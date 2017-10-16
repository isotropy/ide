// @flow
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { sortBy } from 'lodash';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import {
  modulesFromSandboxSelector,
  findMainModule,
  findCurrentModule,
} from 'codesandbox/app/store/entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from 'codesandbox/app/store/entities/sandboxes/directories/selectors';

import type { Sandbox, Module, Directory } from 'codesandbox/common/types';
import sandboxActionCreators from 'codesandbox/app/store/entities/sandboxes/actions';

import DirectoryEntry from './DirectoryEntry/index';

type Props = {
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
  sandboxActions: typeof sandboxActionCreators,
};
const mapStateToProps = createSelector(
  modulesFromSandboxSelector,
  directoriesFromSandboxSelector,
  (modules, directories) => ({ modules, directories })
);
class Files extends React.PureComponent<Props> {
  deleteModule = id => {
    const { sandboxActions, sandbox } = this.props;
    if (sandbox) {
      sandboxActions.deleteModule(sandbox.id, id);
    }
  };

  deleteDirectory = id => {
    const { sandboxActions, sandbox } = this.props;
    if (sandbox) {
      sandboxActions.deleteDirectory(sandbox.id, id);
    }
  };

  render() {
    const { sandbox, modules, directories } = this.props;
    if (sandbox == null) return null;

    const mainModule = findMainModule(modules, sandbox.template);
    const { currentModule: currentModuleId } = sandbox;
    const currentModule = findCurrentModule(
      modules,
      directories,
      currentModuleId,
      mainModule
    );

    return (
      <DirectoryEntry
        root
        title={sandbox.title || 'Project'}
        sandboxId={sandbox.id}
        sandboxTemplate={sandbox.template}
        modules={sortBy(modules, 'title')}
        directories={sortBy(directories, 'title')}
        isInProjectView={sandbox.isInProjectView}
        currentModuleId={currentModule.id}
        id={null}
        shortid={null}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(connect(mapStateToProps)(Files));
