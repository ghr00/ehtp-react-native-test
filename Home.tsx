/* eslint-disable promise/catch-or-return */
/* eslint-disable prettier/prettier */
import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { TextInput, View, Button, Text, SafeAreaView,FlatList, StyleSheet } from 'react-native';

function Home() {
  const [username, setUsername] = React.useState(null);

  const [token, setToken] = React.useState(null);

  const [messages, setMessages] = React.useState([]);

  const [receivedMessage, setReceivedMessage] = React.useState("");

  const [messageText, setMessageText] = React.useState("");

  const [socket, setSocket] = React.useState(null);

  const sendMessage = (text : string) => {

    alert('Envoie du message: ' + text)
    if(socket) {
      alert('socket')
      socket.emit('message', { token, text, platform:'Mobile' }) //send the jwt
    }
      

  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );

  React.useEffect( () => {
    if(receivedMessage.title && receivedMessage.title.length > 0)
    {
      setMessages([...messages, receivedMessage]);
      setReceivedMessage('');
    }
    //alert(messages.length);
  }, [receivedMessage]);

  React.useEffect( () => {

    if(token) {
      const _socket = io.connect('http://localhost:5000');
         
      _socket.on('broadcast',function(data) {
            
        const id = messages.length + 1;

        const listItem = {
              id ,
              title:data.message
        }
        setReceivedMessage(listItem);

      });


      setSocket(_socket);
    }
  }, [token]);

  const sendConnectionReq = () => {
      alert('envoie de demande: ' + username)
      axios.get('http://localhost:5000/login', {params : {username}})
      .then( (response) => {
        setToken(response.data.token);

        alert('reception de demande: ' + username)
        return true;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }
  return (
    <View>
    <Text style={styles.baseText}>
      <Text style={styles.titleText}>
        Amine Yahemdi
        {"\n"}
        {"\n"}
      </Text>
      <Text style={styles.titleText}>
       API de test pour Web2.0
       {"\n"}
      </Text>
      <Text>
      Votre etat: { token ?  <Text>Connecté</Text> : <Text>Deconnecté</Text>}
      </Text>
    </Text>
    <TextInput 
    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
    onChangeText={text => setUsername(text)}
    value={username} />
    <Button 
    onPress={sendConnectionReq}
    title="Se connecter"
    color="#841584"
    />

    {/*
      messages ? <View >{ messages.map(function(item, i){
        return <li key={i}>{item}</li>;
      })}</View > : null*/
    }

    {
      messages ?
      <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      /> : null 
    }

    <TextInput 
    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
    value={messageText}
    onChangeText={text => setMessageText(text)} />

    <Button 
    onPress={() => sendMessage(messageText)}
    title="Envoyer"
    color="#841584"
    />
    </View>
  );
}

const styles = StyleSheet.create({
  baseText: {
    //fontFamily: "Arial"
    fontSize: 16
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});


export default Home;
