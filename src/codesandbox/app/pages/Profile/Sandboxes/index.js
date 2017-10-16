// @flow
import * as React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from 'codesandbox/app/components/buttons/Button';
import type { PaginatedSandboxes } from 'codesandbox/common/types';

import modalActionCreators from 'codesandbox/app/store/modal/actions';
import Alert from 'codesandbox/app/components/Alert';

import SandboxList from 'codesandbox/app/components/sandbox/SandboxList';
import sandboxActionCreators from 'codesandbox/app/store/entities/sandboxes/actions';

const PER_PAGE_COUNT = 15;

const Navigation = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding-bottom: 2rem;
`;

const Notice = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  padding: 2rem 0;
  padding-bottom: 0;
`;

type Props = {
  page: number,
  sandboxCount: number,
  baseUrl: string,
  username: string,
  fetchSandboxes: Function,
  sandboxes: PaginatedSandboxes,
  sandboxActions: typeof sandboxActionCreators,
  modalActions: typeof modalActionCreators,
  isCurrentUser: boolean,
};

class Sandboxes extends React.PureComponent<Props> {
  static defaultProps = {
    page: 1,
  };

  fetch(force = false) {
    const { fetchSandboxes, username, page, sandboxes } = this.props;

    if (force || !sandboxes || !sandboxes[page]) {
      fetchSandboxes(username, page);
    }
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getLastPage = () => {
    const { sandboxCount } = this.props;

    return Math.ceil(sandboxCount / PER_PAGE_COUNT);
  };

  deleteSandbox = (id: string) => {
    const { modalActions } = this.props;

    modalActions.openModal({
      Body: (
        <Alert
          title="Delete Sandbox"
          body={<span>Are you sure you want to delete this sandbox?</span>}
          onCancel={modalActions.closeModal}
          onDelete={async () => {
            await this.props.sandboxActions.deleteSandbox(id);
            this.fetch(true);
            modalActions.closeModal();
          }}
        />
      ),
    });
  };

  render() {
    const { sandboxes, isCurrentUser, page, baseUrl } = this.props;
    if (!sandboxes || !sandboxes[page]) return <div />;
    return (
      <div>
        {isCurrentUser && (
          <Notice>
            You{"'"}re viewing your own profile, so you can see your private and
            unlisted sandboxes. Others can{"'"}t.
          </Notice>
        )}
        <SandboxList
          isCurrentUser={isCurrentUser}
          sandboxes={sandboxes[page]}
          onDelete={this.deleteSandbox}
        />
        <Navigation>
          <div>
            {page > 1 && (
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page - 1}`}
              >
                {'<'}
              </Button>
            )}
            {this.getLastPage() !== page && (
              <Button
                style={{ margin: '0 0.5rem' }}
                small
                to={`${baseUrl}/${page + 1}`}
              >
                {'>'}
              </Button>
            )}
          </div>
        </Navigation>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

export default connect(undefined, mapDispatchToProps)(Sandboxes);
