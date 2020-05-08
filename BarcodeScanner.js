import React, { Component } from 'react';
import { Button, Text, View, Image, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Dialog, { DialogContent, DialogTitle } from 'react-native-popup-dialog';

class BarcodeScaner extends Component {

  constructor(props) {
    super(props);
    this.camera = null;
    this.barcodeCodes = [];

    this.state = {
      camera: {
        type: RNCamera.Constants.Type.back,
	flashMode: RNCamera.Constants.FlashMode.auto,
      },
      imageUri:undefined,
      barcodeData:undefined,
      cameraOn:false,
      visible: false
    };
  }

  onBarCodeRead(scanResult) {
    console.warn(scanResult.type);
    console.warn(scanResult.data);
    if (scanResult.data != null) {
        console.log("scanResult" + JSON.stringify(scanResult));
       // if (!this.barcodeCodes.includes(scanResult.data)) {
       // this.barcodeCodes.push(scanResult.data);
     //   console.log('onBarCodeRead call'+ JSON.stringify(this.barcodeCodes));
        this.takePicture(scanResult.data);
      //  }
    }
    return;
  }

  async takePicture(barcode) {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri + '\t' + barcode);
      this.setState({imageUri:data.uri, barcodeData:barcode, cameraOn:false,visible: true })

    }
  }

  pendingView() {
      console.log("Image uri" + this.state.imageUri);
      console.log("barcodeData date" + this.state.barcodeData);
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
    <Image source={{ uri:this.state.imageUri }} style={{ height: 170, width: 180 }} />
    <Text style={{color:'black'}}>Barcode Details:- {this.state.barcodeData}</Text>

      </View>
    );
  }

  render() {
      const {cameraOn} = this.state;
    return (
      <View style={styles.container}>
          {/* {this.state.imageUri ? 
        this.pendingView() : undefined} */}
          {cameraOn ?
          <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              defaultTouchToFocus
              flashMode={this.state.camera.flashMode}
              mirrorImage={false}
              onBarCodeRead={this.onBarCodeRead.bind(this)}
              
              onFocusChanged={() => {}}
              onZoomChanged={() => {}}
              // useNativeZoom={true}
              
              // permissionDialogTitle={'Permission to use camera'}
              // permissionDialogMessage={'We need your permission to use your camera phone'}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              style={styles.preview}
              type={this.state.camera.type}
          /> : <View style={[styles.overlay, styles.bottomOverlay],{top:'50%',justifyContent: 'center',
          alignItems: 'center',width:300,alignSelf:'center', color:'white'}}>
          <Button
            onPress={() => { this.setState({cameraOn:true, imageUri:undefined,
              barcodeData:undefined}) }}
            style={styles.enterBarcodeManualButton}
            title="Please scan the barcode"
            backgroundColor={'skyblue'}
            olor="#ff5c5c"
          />


        </View>}
          <View style={[styles.overlay, styles.topOverlay],{marginTop:0}}>
            <Text style={styles.scanScreenMessage}>Please scan the barcode.</Text>
        </View>
        <Dialog
    visible={this.state.visible}
    onTouchOutside={() => {
      this.setState({ visible: false });
    }}
    dialogTitle={<DialogTitle title="Barcode scan data" />} 
    height={400} >
    <DialogContent>
    <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          height:400
        }}
      >
    <Image source={{ uri:this.state.imageUri }} style={{ height: 170, width: 180 }} />
    <Text style={{color:'black'}}>Barcode Details:- {this.state.barcodeData}</Text>

      </View>
    </DialogContent>
  </Dialog>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
   // position: 'absolute',
    padding: 16,
    top:0,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  enterBarcodeManualButton: {
    padding: 15,
    color:'white',
    backgroundColor: 'white',
    borderRadius: 40
  },
  scanScreenMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default BarcodeScaner;