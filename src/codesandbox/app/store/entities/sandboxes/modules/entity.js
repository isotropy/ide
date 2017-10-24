// @flow
import { schema } from 'normalizr';

const getDefaultCode = module => {
  if (module.title.endsWith('.vue')) {
    return `<template>

</template>

<script>
export default {

}
</script>

<style>

</style>
`;
  }

  return '';
};

export default new schema.Entity(
  'modules',
  {},
  {
    processStrategy: module => {
      const defaultCode = getDefaultCode(module);
      const shouldUpdate = module.contents == null;
      const code = shouldUpdate ? defaultCode : module.contents;

      const isNotSynced = shouldUpdate && defaultCode !== module.code;
      return {
        ...module,
        errors: [],
        corrections: [],
        code,
        isNotSynced,
      };
    },
  }
);
