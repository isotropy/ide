/* @flow */
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { CurrentUser, Badge as BadgeT } from 'codesandbox/common/types';

import userActionCreators from 'codesandbox/app/store/user/actions';
import { currentUserSelector } from 'codesandbox/app/store/user/selectors';
import Margin from 'codesandbox/app/components/spacing/Margin';
import Badge from 'codesandbox/app/utils/badges/Badge';

const mapDispatchToProps = dispatch => ({
  userActions: bindActionCreators(userActionCreators, dispatch),
});
const mapStateToProps = state => ({
  user: currentUserSelector(state),
});
class BadgesContent extends React.PureComponent<{
  user: CurrentUser,
  userActions: typeof userActionCreators,
}> {
  toggleVisibility = (badge: BadgeT) => {
    this.props.userActions.setBadgeVisibility(badge.id, !badge.visible);
  };

  render() {
    const { user } = this.props;

    const badgesCount = user.badges.length;

    return (
      <div>
        <strong>
          You currently have {badgesCount} badge{badgesCount === 1 ? '' : 's'}.
          You can click on the badges to toggle visibility.
        </strong>
        <Margin top={2}>
          {user.badges.map(b => (
            <Badge
              tooltip={false}
              onClick={this.toggleVisibility}
              badge={b}
              size={128}
            />
          ))}
        </Margin>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BadgesContent);
