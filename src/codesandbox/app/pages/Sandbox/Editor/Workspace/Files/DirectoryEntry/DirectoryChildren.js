// @flow
import * as React from 'react';

import type { Module, Directory } from 'codesandbox/common/types';

import { validateTitle } from 'codesandbox/app/store/entities/sandboxes/modules/validator';
import { isMainModule } from 'codesandbox/app/store/entities/sandboxes/modules/selectors';
import getType from 'codesandbox/app/store/entities/sandboxes/modules/utils/get-type';

import Entry from './Entry';
import DirectoryEntry from './';

type Props = {
  depth: number,
  renameModule: (id: string, title: string) => boolean,
  directories: Array<Directory>,
  modules: Array<Module>,
  openMenu: (event: Event) => any,
  sandboxId: string,
  deleteEntry: (id: string) => any,
  setCurrentModule: (id: string) => any,
  currentModuleId: ?string,
  parentShortid: string,
  isInProjectView: boolean,
  parentShortid: string,
  sandboxTemplate: string,
};

export default class DirectoryChildren extends React.PureComponent<Props> {
  validateTitle = (id: string, title: string) => {
    const { directories, modules } = this.props;
    return !!validateTitle(id, title, [...directories, ...modules]);
  };

  render() {
    const {
      depth = 0,
      renameModule,
      openMenu,
      setCurrentModule,
      directories,
      parentShortid,
      sandboxId,
      sandboxTemplate,
      modules,
      deleteEntry,
      currentModuleId,
      isInProjectView,
    } = this.props;

    return (
      <div>
        {directories
          .filter(x => x.directoryShortid === parentShortid)
          .map(dir => (
            <DirectoryEntry
              key={dir.id}
              siblings={[...directories, ...modules]}
              depth={depth + 1}
              id={dir.id}
              shortid={dir.shortid}
              title={dir.title}
              sandboxId={sandboxId}
              sandboxTemplate={sandboxTemplate}
              modules={modules}
              directories={directories}
              currentModuleId={currentModuleId}
              isInProjectView={isInProjectView}
            />
          ))}
        {modules.filter(x => x.directoryShortid === parentShortid).map(m => {
          const isActive = m.id === currentModuleId;
          const mainModule = isMainModule(m, sandboxTemplate);
          const type = getType(m);

          const hasError = m && m.errors.length;

          return (
            <Entry
              key={m.id}
              id={m.id}
              shortid={m.shortid}
              title={m.title}
              depth={depth + 1}
              active={isActive}
              type={type || 'function'}
              rename={mainModule ? undefined : renameModule}
              openMenu={openMenu}
              deleteEntry={mainModule ? undefined : deleteEntry}
              isNotSynced={m.isNotSynced}
              renameValidator={this.validateTitle}
              setCurrentModule={setCurrentModule}
              isInProjectView={isInProjectView}
              isMainModule={mainModule}
              moduleHasError={hasError}
            />
          );
        })}
      </div>
    );
  }
}
