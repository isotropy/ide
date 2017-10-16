// @flow
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GithubIcon from 'react-icons/lib/go/mark-github';

import userActionCreators from 'codesandbox/app/store/user/actions';
import Button from 'codesandbox/app/components/buttons/Button';
import Row from 'codesandbox/app/components/flex/Row';

type Props = {
  userActions: typeof userActionCreators,
};

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
const SignInButton = ({ userActions, ...props }: Props) => (
  <Button small onClick={userActions.signIn} {...props}>
    <Row>
      <GithubIcon style={{ marginRight: '0.5rem' }} /> Sign in with GitHub
    </Row>
  </Button>
);

export default connect(null, mapDispatchToProps)(SignInButton);
