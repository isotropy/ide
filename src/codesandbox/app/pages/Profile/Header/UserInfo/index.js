// @flow
import * as React from 'react';
import type { User } from 'codesandbox/common/types';

import Row from 'codesandbox/app/components/flex/Row';

import ProfileInfo from './ProfileInfo';
import Stats from './Stats';

type Props = {
  user: User,
};

export default ({ user }: Props) => (
  <Row>
    <ProfileInfo
      username={user.username}
      name={user.name}
      avatarUrl={user.avatarUrl}
      subscriptionSince={user.subscriptionSince}
    />
    <Stats
      likeCount={user.receivedLikeCount}
      viewCount={user.viewCount}
      forkCount={user.forkedCount}
      badges={user.badges}
    />
  </Row>
);
