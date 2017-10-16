// @flow
import _debug from 'codesandbox/app/utils/debug';
import type { CurrentUser } from 'codesandbox/common/types';

const debug = _debug('cs:analytics');

const sentryAvailable = () => typeof window.Raven === 'object';

function identifySentry(user: CurrentUser) {
  if (!sentryAvailable()) return;

  window.Raven.setUserContext({
    id: user.id,
    username: user.username,
  });
}

export function identify(user: CurrentUser) {
  debug(`Identified ${user.username}`);
  identifySentry(user);
}
