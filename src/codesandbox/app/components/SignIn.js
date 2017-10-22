import React from 'react';
import styled from 'styled-components';
import Button from './buttons/Button';
import userActionCreators from 'codesandbox/app/store/user/actions';

type Props = {
  signInAction: typeof userActionCreators,
};

const Container = styled.div`
display: flex;
flex-direction: column;
background-color: ${props => props.theme.background};
color: rgba(255, 255, 255, 0.8);
padding: 0.75rem;
text-align: center;
`;

const Buttons = styled.div`
display: flex;
justify-content: center;
margin-top: 1rem;
button {
  display: flex;
  justify-content: center;
  width: 6rem;
  margin: 0.5rem;
}
`;

export default class SignIn extends React.PureComponent {
  props: Props;
  handleClick = () => {
    this.props.signInAction();    
  };

  render() {
      return(
        <Container>
          Sign in using
          <Buttons>
            <Button block onClick={this.handleClick}>Github</Button>
            <Button block onClick={this.handleClick}>Google</Button>
            <Button block onClick={this.handleClick}>Facebook</Button>
          </Buttons>
        </Container>
      );
  }
}
