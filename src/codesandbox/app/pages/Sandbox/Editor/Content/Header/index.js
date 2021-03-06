// @flow
import * as React from 'react';
import styled from 'styled-components';
import Media from 'react-media';

import Save from 'react-icons/lib/md/save';
import Fork from 'react-icons/lib/go/repo-forked';
import Download from 'react-icons/lib/go/cloud-download';
import Deploy from 'react-icons/lib/go/rocket';
import PlusIcon from 'react-icons/lib/go/plus';
import GithubIcon from 'react-icons/lib/go/mark-github';
import ChevronLeft from 'react-icons/lib/md/chevron-left';
import NowIcon from 'codesandbox/app/components/NowLogo';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import TwitterIcon from 'react-icons/lib/fa/twitter';
import SettingsIcon from 'react-icons/lib/md/settings';
import { Tooltip } from 'react-tippy';

import type { Sandbox, CurrentUser } from 'codesandbox/common/types';
import sandboxActionCreators from 'codesandbox/app/store/entities/sandboxes/actions';
import userActionCreators from 'codesandbox/app/store/user/actions';
import modalActionCreators from 'codesandbox/app/store/modal/actions';
import ModeIcons from 'codesandbox/app/components/sandbox/ModeIcons';

// $FlowIssue
import PatronBadge from '-!svg-react-loader!codesandbox/app/utils/badges/svg/patron-4.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import Margin from 'codesandbox/app/components/spacing/Margin';
import UserMenu from 'codesandbox/app/containers/UserMenu';
import Preferences from 'codesandbox/app/containers/Preferences';
import NewSandbox from 'codesandbox/app/containers/modals/NewSandbox';
import SignIn from 'codesandbox/app/components/SignIn';

import Deployment from 'codesandbox/app/containers/Deployment';

import Action from './Action';
import FeedbackView from './FeedbackView';

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.background2};
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  z-index: 40;
  margin: 0;
  height: 3rem;
  font-weight: 400;
  flex: 0 0 3rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Left = styled.div`
  display: flex;
  height: 100%;
`;

const Chevron = styled.div`
  svg {
    transition: 0.3s ease all;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 3rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    z-index: 20;

    cursor: pointer;
    &:hover {
      transform: rotateZ(
        ${props => (props.workspaceHidden ? '135deg' : '45deg')}
      );
      color: white;
    }

    transform: rotateZ(${props => (props.workspaceHidden ? '180deg' : '0')});
  }
`;

type Props = {
  toggleWorkspace: () => void,
  workspaceHidden: boolean,
  sandbox: Sandbox,
  sandboxActions: typeof sandboxActionCreators,
  userActions: typeof userActionCreators,
  modalActions: typeof modalActionCreators,
  user: CurrentUser,
  canSave: boolean,
};

export default class Header extends React.PureComponent<Props> {
  massUpdateModules = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.massUpdateModules(sandbox.id);
  };

  uploadToGitlab = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.uploadToGitlab(sandbox.id);
  }

  deploySandbox = () => {
    const { sandbox } = this.props;

    this.props.modalActions.openModal({
      width: 600,
      Body: <Deployment id={sandbox.id} />,
    });
  };

  zipSandbox = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.createZip(sandbox.id);
  };

  forkSandbox = () => {
    const { sandbox, sandboxActions } = this.props;

    const shouldFork = sandbox.owned
      ? confirm('Do you want to fork your own sandbox?') // eslint-disable-line no-alert
      : true;
    if (shouldFork) {
      sandboxActions.forkSandbox(sandbox.id);
    }
  };

  setEditorView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, false);
  };

  setMixedView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, true, true);
  };

  setPreviewView = () => {
    const { sandbox, sandboxActions } = this.props;
    sandboxActions.setViewMode(sandbox.id, false, true);
  };

  toggleLike = () => {
    const { sandbox, sandboxActions } = this.props;

    if (sandbox.userLiked) {
      sandboxActions.unLikeSandbox(sandbox.id);
    } else {
      sandboxActions.likeSandbox(sandbox.id);
    }
  };

  openPreferences = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: <Preferences />,
    });
  };

  openSignIn = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: <SignIn signInAction={this.props.userActions.signIn} />,
    });
  };

  openNewSandbox = () => {
    this.props.modalActions.openModal({
      width: 900,
      Body: <NewSandbox />,
    });
  };

  render() {
    const {
      sandbox,
      userActions,
      user,
      toggleWorkspace,
      workspaceHidden,
      canSave,
    } = this.props;

    return (
      <Container>
        <ModeIcons
          small
          dropdown
          showEditor={sandbox.showEditor}
          showPreview={sandbox.showPreview}
          setMixedView={this.setMixedView}
          setEditorView={this.setEditorView}
          setPreviewView={this.setPreviewView}
        />
        <Left>
          <Tooltip
            title={workspaceHidden ? 'Open sidebar' : 'Collapse sidebar'}
          >
            <Chevron
              workspaceHidden={workspaceHidden}
              onClick={toggleWorkspace}
            >
              <ChevronLeft />
            </Chevron>
          </Tooltip>
          <Action onClick={this.forkSandbox} title="Fork" Icon={Fork} />
          <Action
            onClick={canSave ? this.massUpdateModules : null}
            placeholder={canSave ? false : 'All modules are saved'}
            title="Save"
            Icon={Save}
          />
          <Action title="Download" Icon={Download} onClick={this.zipSandbox} />
          <Action title="Deploy" Icon={Deploy} onClick={this.deploySandbox} />
        </Left>

        <Right>
          <Action
            onClick={this.openNewSandbox}
            tooltip="New Sandbox"
            Icon={PlusIcon}
          />
          <Action
            onClick={this.openPreferences}
            tooltip="Preferences"
            Icon={SettingsIcon}
          />
          <Margin
            style={{
              zIndex: 20,
              height: '100%',
            }}
            left={1}
          >
            {user.jwt ? (
              <div style={{ fontSize: '.875rem', margin: '6px 0.5rem' }}>
                <UserMenu small />
              </div>
            ) : (
              <Action
                onClick={this.openSignIn}
                title="Sign in"
                Icon={GithubIcon}
                highlight
                unresponsive
              />
            )}
          </Margin>
        </Right>
      </Container>
    );
  }
}
