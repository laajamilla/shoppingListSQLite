import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [ product, setProduct ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ shopping, setShopping ] = useState([]);


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount text, product text);');
    }, null, updateList);
  }, []);


  const saveItem = () => {
    console.log("saveItem funktio")
    db.transaction(tx => {
      tx.executeSql('insert into shoppinglist (amount, product) values (?, ?);', [amount, product]);
    }, null, updateList)
    setProduct('');
    setAmount('');
  }

  const updateList = () => {
    console.log("updateList funktio")
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) => setShopping(rows._array));
    }, null, null)

  }

  const deleteProduct = (id) => {
    console.log("delete funktio");
    console.log(id);

    db.transaction(tx => {
      tx.executeSql('delete from shoppinglist where id=?;', [id]);
    }, null, updateList)
  }

  const listSeparator = () => {
    return(
      <View
        style={{
          height: 5,
          width: '80 %',
          marginLeft: '10 %'
        }}
      
      ></View>
    )
  }
 

  return (
    <View style={styles.container}>
      
      <TextInput
        style={{marginTop:40, fontSize: 18, width: 200, borderColor: 'grey', borderWidth: 1}}
        onChangeText={text => setProduct(text)}
        value={product}
        placeholder='product'
      ></TextInput>
      <TextInput
        style={{marginTop:5, marginBottom: 5, fontSize: 18, width: 200, borderColor: 'grey', borderWidth: 1}}
        onChangeText={text => setAmount(text)}
        value={amount}
        placeholder='amount'
      ></TextInput>
      <Button
        style={styles.button}
        title='save'
        onPress={saveItem}
      
      ></Button>
      
      <FlatList
        ListHeaderComponent={<Text style={{fontWeight: 'bold', fontSize: 16}}>Shopping list</Text>}
        data={shopping}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={listSeparator}
        renderItem={({item}) => <View><Text>{item.product}, {item.amount} 
        <Text style={{color: 'blue'}} onPress={() => deleteProduct(item.id)}>  brought</Text>
        </Text>
        </View>}
      ></FlatList>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 200,
    fontSize: 18,
    marginTop: 25,
    marginBottom: 5
  },
  button: {
    
  }
});
