import styled from 'styled-components';
import theme from 'codesandbox/common/theme';

export default styled.button`
  display: inline-block;
  background-color: transparent;
  color: ${() => theme.secondary()};
  border: none;
  outline: none;
  cursor: pointer;
  text-decoration: underline;
`;
