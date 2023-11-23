import React from 'react';
import { Card, CardText, Container, Header, Informations, Name, Picture } from './styles';

export default function Profile() {
  return (
    <Container>
      <Header>
        <Picture/>
        <Name>Nome</Name>
      </Header>
      <Informations>
        <Card>
          <CardText>Telefone: (99) 99999-9999</CardText>
        </Card>
        <Card>
          <CardText>Universidades/Escolas: FAG, Univel e Unipar</CardText>
        </Card>
        <Card>
          <CardText>Assentos disponíveis: 4</CardText>
        </Card>
        <Card>
          <CardText>Sobre: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla consectetur ante in. </CardText>
        </Card>
      </Informations>
    </Container>
  );
}
