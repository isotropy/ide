// @flow
import type { Sandbox } from 'codesandbox/common/types';

const buildEncodedUri = (strings: Array<string>, ...values: Array<string>) =>
  strings[0] +
  values
    .map((value, i) => `${encodeURIComponent(value)}${strings[i + 1]}`)
    .join('');

export const host = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'edit.looptype.com';
  }
  if (process.env.LOCAL_SERVER) {
    return 'localhost:3000';
  }
  return 'edit.looptype.com';
};

export const protocolAndHost = () => `${location.protocol}//${host()}`;

export const newSandboxUrl = () => `/s/new`;
export const newReactTypeScriptSandboxUrl = () => `/s/react-ts`;
export const newPreactSandboxUrl = () => `/s/preact`;
export const newVueSandboxUrl = () => `/s/vue`;
export const importFromGitHubUrl = () => `/s/github`;
export const newSvelteSandboxUrl = () => `/s/svelte`;
export const uploadFromCliUrl = () => `/s/cli`;

const sandboxGitUrl = (git: {
  repo: string,
  branch: string,
  username: string,
  path: string,
}) =>
  buildEncodedUri`github/${git.username}/${git.repo}/tree/${git.branch}/` +
  git.path;

export const sandboxUrl = (sandbox: Sandbox) => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/s/${sandboxGitUrl(git)}`;
  }

  return `/s/${sandbox.id}`;
};
export const embedUrl = (sandbox: Sandbox) => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/embed/${sandboxGitUrl(git)}`;
  }

  return `/embed/${sandbox.id}`;
};

export const frameUrl = (shortid: string, append: string = '') => {
  const path = append.indexOf('/') === 0 ? append.substr(1) : append;
  const loopHost = 'looptype.com';

  if (process.env.LOCAL_SERVER) {
    return `http://localhost:3001/${path}`;
  }

  return `${location.protocol}//${shortid}.${loopHost}/${path}`;
};

export const forkSandboxUrl = (sandbox: Sandbox) =>
  `${sandboxUrl(sandbox)}/fork`;

export const signInUrl = hostName => {
  const root = process.env.LOCAL_SERVER ? 'http://localhost:8080' : '';
  switch(hostName) {
    case 'github':
      return `${root}/auth/github`;
    case 'google':
      return `${root}/auth/google`;
    case 'facebook':
      return `${root}/auth/facebook`;
    default:
      return '';
  }
};

export const signInZeitUrl = () => '/auth/zeit';

export const profileUrl = (username: string) => `/u/${username}`;
export const profileSandboxesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/sandboxes${page ? `/${page}` : ''}`;
export const profileLikesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/likes${page ? `/${page}` : ''}`;

export const githubRepoUrl = ({
  repo,
  branch,
  username,
  path,
}: {
  repo: string,
  branch: string,
  username: string,
  path: string,
}) =>
  buildEncodedUri`https://github.com/${username}/${repo}/tree/${branch}/` +
  path;

export const optionsToParameterizedUrl = (options: Object) => {
  const keyValues = Object.keys(options)
    .sort()
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`
    )
    .join('&');

  return keyValues ? `?${keyValues}` : '';
};

export const gitHubToSandboxUrl = (githubUrl: string) =>
  githubUrl.replace(/https?:\/\/(www.)?github.com/, '/s/github');

export const searchUrl = query => `/search${query ? `?query=${query}` : ''}`;
export const patronUrl = () => `/patron`;
export const tosUrl = () => `/legal/terms`;
export const privacyUrl = () => `/legal/privacy`;
