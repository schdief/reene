import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, Button, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Reene</Text>
      <Button
        title="Schandfleck fotografieren"
        onPress={() => {
            //TODO: take picture
        }}
      />
      <Button
        title="mache reene"
        color="#f194ff"
        onPress={() => {
          const data = new FormData();
          //yes we want feedback, 0 for no feedback
          data.append('resprequ', 1);

          //specify kind of dirt
          data.append('dirtkey', 'sonst');

          //description
          data.append('desc', 'Müll');

          //reporter data
          //TODO: add form to let user enter own data and save it locally
          data.append('rlname', 'Lohr');
          data.append('rfname', 'Steve');
          data.append('remail', '');
          data.append('rtel', '');

          //append gps location
          //TODO: get gps location
          data.append('lat', '51.0529371');
          data.append('lng', '13.7636763');

          //append date
          //TODO: get date
          data.append('date', '2021-04-25T17:44:30.936Z');

          //append picture
          data.append('file', ''); //not sure why it is in the original request...
          //TODO: use taken picture
          data.append('file', new Blob(['test payload'], { type: 'image/jpeg' }));

          const header = {
            headers: {
               //'Host': 'dreckweg.dresden.de',
               'Content-Type': 'multipart/form-data; boundary=+++++org.apache.cordova.formBoundary',
               //'Accept-Encoding': 'gzip; deflate; br',
               //'Connection': 'keep-alive',
               'Accept': '*/*',
               'Accept-Language': 'de-de',
               'X-Requested-With': 'XMLHttpRequest'
             }
          }

          //TODO: use real URL: https://dreckweg.dresden.de/DreckWeg/AppDataServlet
          axios.post('http://localhost:8000', data, header)
               .then(function (response) {
                 //TODO: get visual feedback
                 console.log(response);
               })
               .catch(function (error) {
                 //TODO: get visual feedback
                 console.log(error);
               });
        }}
      />
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
});
