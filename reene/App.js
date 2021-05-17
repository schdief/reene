import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, Button, View, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import { Camera } from 'expo-camera';
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
        //TODO: take a jpeg instead of png
        const photo: any = await camera.takePictureAsync()
        setCapturedImage(photo)
        setPreviewVisible(true)
    }

    //send data to dreckweg
    const __savePhoto = () => {
        //send data to dreckweg
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
        let date = new Date();
        data.append('date', date.toISOString());
        //append picture
        data.append('file', dataURItoBlob(capturedImage.base64), 'file');

        //set request headers
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

        //finally send data to dreckweg
        //TODO: use real URL: https://dreckweg.dresden.de/DreckWeg/AppDataServlet

        axios.post('http://localhost:8001', data, header)
             .then(function (response) {
                //TODO: get visual feedback
                console.log(response);
             })
             .catch(function (error) {
                //TODO: get visual feedback
                console.log(error);
             });
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

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    var ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;
}
