import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, Button, View, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import ReactNativeBlobUtil from 'react-native-blob-util';
let camera: Camera

export default function App() {

    const [startCamera, setStartCamera] = React.useState(false)
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [capturedImage, setCapturedImage] = React.useState(null)
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)

    //before we can start the camera we need to request and check camera permissions
    const __startCamera = async () => {
        const {status} = await Camera.requestPermissionsAsync()
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Access to camera denied')
        }
    }

    //take a picture and open preview
    const __takePicture = async () => {
        const photo: any = await camera.takePictureAsync()
        setCapturedImage(photo)
        setPreviewVisible(true)
    }

    async function photoToBlob(sourceUrl) {
        // first get our hands on the local file
        const localFile = await fetch(sourceUrl);
        // then create a blob out of it (only works with RN 0.54 and above)
        const fileBlob = await localFile.blob();
        return fileBlob;
    }

    //send data to dreckweg
    const __savePhoto = ({photo}) => {
         //TODO: use real URL: https://dreckweg.dresden.de/DreckWeg/AppDataServlet
         ReactNativeBlobUtil.fetch('POST', 'http://localhost:8000', {
            'Accept': '*/*',
            'Accept-Language': 'de-de',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type' : 'multipart/form-data; boundary=+++++org.apache.cordova.formBoundary'
         }, [
            // append field data from file path
            {
              name : 'file',
              filename : 'file',
              // Change BASE64 encoded data to a file path with prefix `ReactNativeBlobUtil-file://`.
              // Or simply wrap the file path with ReactNativeBlobUtil.wrap().
              data: ReactNativeBlobUtil.wrap(capturedImage.uri)
            },
            // elements without property `filename` will be sent as plain text
            { name : 'resprequ', data : 0},
            { name : 'dirtkey', data : 'sonst'},
            { name : 'desc', data : 'Müll'},
            { name : 'rlname', data : ''},
            { name : 'rfname', data : ''},
            { name : 'remail', data : ''},
            { name : 'rtel', data : ''},
            { name : 'lat', data : 51.0529371},
            { name : 'lng', data : 13.7636763},
            { name : 'date', data : new Date().toISOString()},
         ]).then((resp) => {
            //TODO: get visual feedback
            console.log(resp);
         }).catch((err) => {
            //TODO: get visual feedback
            console.log(err);
         })
        //TODO: add form to let user enter own data and save it locally
        //TODO: get gps location
    }

    //either render start screen, or camera interface/image preview
    //picture is already taken? then show preview and send dialogue
    if(previewVisible && capturedImage) {
        return (
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    width: '100%'
                }}>
                    <CameraPreview photo={capturedImage} savePhoto={__savePhoto} />
                </View>
            </View>
        )
    }
    //display camera feed if no picture has been taken yet, but camera button was triggered
    if(startCamera) {
        return (
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    width: '100%'
                }}>
                    //TODO: move to separate const like CameraPreview
                    <Camera
                        type={cameraType}
                        style={{flex: 1}}
                        ref={(r) => {
                            camera = r
                        }}
                    >
                        //overlay button to take picture
                        <View style={{
                            alignSelf: 'center',
                            flex: 1,
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity
                                onPress={__takePicture}
                                style={{
                                    width: 70,
                                    height: 70,
                                    bottom: 0,
                                    borderRadius: 50,
                                    backgroundColor: '#fff'
                                }}
                            />
                        </View>
                    </Camera>
                </View>
            </View>
        )
    }
    //render startup screen in case no picture was taken yet and camera button wasn't triggered
    return (
        <View style={styles.container}>
            //show startup screen
            //TODO: move to separate const like CameraPreview
            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            >
                <Text>Reene</Text>
                <TouchableOpacity
                    onPress={__startCamera}
                    style={{
                        width: 130,
                        borderRadius: 4,
                        backgroundColor: '#14274e',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        Schande fotografieren
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

//screen to render when picture was taken and to send report
const CameraPreview = ({photo, savePhoto}: any) => {
    return (
        <View style={{
            backgroundColor: 'transparent',
            flex: 1,
            width: '100%',
            height: '100%'
        }}>
            //TODO: don't use it as background but only big preview with send button below
            //display taken image as background
            <ImageBackground
                source={{uri: photo && photo.uri}}
                style={{
                    flex: 1
                }}
            >
                <TouchableOpacity
                    onPress={savePhoto(photo)}
                    style={{
                        width: 130,
                        height: 40,
                        alignItems: 'center',
                        borderRadius: 4
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontSize: 20
                    }}>
                        mache reene
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}
