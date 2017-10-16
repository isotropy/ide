// @flow
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import type { Sandbox, Module, Directory } from 'codesandbox/common/types';
import { react, reactTs, vue, preact, svelte } from 'codesandbox/common/templates/index';

const CSSTag = (resource: string) =>
  `<link rel="stylesheet" type="text/css" href="${resource}" media="all">`;
const JSTag = (resource: string) =>
  `<script src="${resource}" async="false"></script>`;

export function getResourceTag(resource: string) {
  const kind = resource.match(/\.([^.]*)$/);

  if (kind && kind[1] === 'css') {
    return CSSTag(resource);
  }

  return JSTag(resource);
}

export function getIndexHtmlBody(modules: Array<Module>) {
  const indexHtmlModule = modules.find(
    m => m.title === 'index.html' && m.directoryShortid == null
  );

  if (indexHtmlModule) {
    return indexHtmlModule.code || '';
  }

  return `<div id="root"></div>`;
}

function slugify(text) {
  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');

  /* eslint-disable */
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
  /* eslint-enable */
}

export function createPackageJSON(
  sandbox: Sandbox,
  dependencies: Object,
  devDependencies: Object,
  scripts: Object,
  extra: Object
) {
  const name = slugify(sandbox.title || sandbox.id);
  const version = `0.0.${sandbox.version}`;

  return JSON.stringify(
    {
      name,
      description: sandbox.description,
      version,
      dependencies: { ...sandbox.npmDependencies, ...dependencies },
      devDependencies,
      scripts,
      ...(extra || {}),
    },
    null,
    '  '
  );
}

export function createDirectoryWithFiles(
  modules: Array<Module>,
  directories: Array<Directory>,
  directory: Directory,
  zip
) {
  const newZip = zip.folder(directory.title);

  modules
    .filter(x => x.directoryShortid === directory.shortid)
    .forEach(x => newZip.file(x.title, x.code));

  directories
    .filter(x => x.directoryShortid === directory.shortid)
    .forEach(x => createDirectoryWithFiles(modules, directories, x, newZip));
}

export async function createZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const zip = new JSZip();

  let promise = null;
  if (sandbox.template === react.name) {
    promise = import('./create-react-app').then(generator =>
      generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === reactTs.name) {
    promise = import('./create-react-app-typescript').then(generator =>
      generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === vue.name) {
    promise = import('./vue-cli').then(generator =>
      generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === preact.name) {
    promise = import('./preact-cli').then(generator =>
      generator.default(zip, sandbox, modules, directories)
    );
  } else if (sandbox.template === svelte.name) {
    promise = import('./svelte').then(generator =>
      generator.default(zip, sandbox, modules, directories)
    );
  }

  if (promise) {
    await promise;
    const file = await zip.generateAsync({ type: 'blob' });

    return file;
  }

  return null;
}

export default (async function downloadZip(
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>
) {
  const file = await createZip(sandbox, modules, directories);

  if (file) {
    saveAs(file, `${slugify(sandbox.title || sandbox.id)}.zip`);
  }
});
