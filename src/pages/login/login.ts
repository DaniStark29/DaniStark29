import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomePage } from '../home/home';
import { TelefonoUserPage } from '../telefono-user/telefono-user';
import { TipoLugarPage } from '../tipo-lugar/tipo-lugar';
import { LoginCorreoPage } from '../login-correo/login-correo';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  us: any;
  codigos: any;
  telefono: any;
  url: any;
  usPhotoUrl: any;

  acti: any[];
  botones_inicio: any = {};
  scope: string;

  pageLogin = "admin-login";

  constructor(public navCtrl: NavController,
    public usuarioProv: UsuarioProvider,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private fb: Facebook,
    public afs: AngularFirestore,
    public navParams: NavParams) {

    this.afs
      .collection("sistema").doc('botones_inicio')
      .valueChanges()
      .subscribe(data => {
        this.botones_inicio = data;
        console.log("botones_inicio", this.botones_inicio);
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  signInWithFacebook() {
    if (this.platform.is("cordova")) {
      console.log("Pasa el platform");

      this.fb
        .login(["public_profile", "email"])
        .then((res: FacebookLoginResponse) => {

          console.log("pasa el public_profile");

          // The connection was successful
          if (res.status == "connected") {
            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            console.log("variable fb_id", fb_id);
            console.log("variable res", res);


            // Get user infos from the API
            this.fb
              .api(
                "me?fields=id,name,email,picture.width(720).height(720).as(picture_large)",
                []
              )
              .then(user => {
                console.log("pasa el then user", JSON.stringify(user));

                console.log("pasa el then(user)");
                this.us = user;
                console.log('Usuario: ', JSON.stringify(this.us));
                localStorage.setItem("uid", this.us.id);
                console.log("Picture", this.us.picture_large.data.url);

                //console.log('userID',this.us.uid);
                this.url = "?height=500";
                this.usPhotoUrl = this.us.picture_large.data.url;

                this.usuarioProv.cargarUsuario(
                  this.us.name,
                  this.us.email,
                  this.us.picture_large.data.url,
                  this.us.id,
                  'facebook'
                );


                this.usuarioProv.getCodigo(this.us.id).subscribe(co => {
                  this.codigos = co;
                  console.log('datos tabla user', this.codigos.length);
                  if (localStorage.getItem('uid') == undefined) {
                    console.log('agregar tel');
                    this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                      uid: this.us.id,
                      displayName: this.us.name,
                      email: this.us.email,
                      photoURL: this.usPhotoUrl,
                      playerID: localStorage.getItem('playerID'),
                      phoneNumber: 'null',
                      provider: 'facebook',
                      status_foto: 0,
                      type: 'u',
                      ciudad: 'null'
                    });
                    this.navCtrl.setRoot(TelefonoUserPage, {
                      idUsuario: this.us.id
                    });

                    this.codigos.forEach(data => {
                      console.log('telefonoforeach', data.phoneNumber);
                      this.telefono = data.phoneNumber;
                      //console.log('telefono',data.phoneNumber);
                      if (data.phoneNumber == 'null' || data.phoneNumber == undefined || data.phoneNumber == null) {
                        console.log('No existe telefono manda a telefono');
                        console.log('telefonoif', data.phoneNumber);
                        this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                          uid: this.us.id,
                          displayName: this.us.name,
                          email: this.us.email,
                          photoURL: this.usPhotoUrl,
                          playerID: localStorage.getItem('playerID'),
                          phoneNumber: 'null',
                          provider: 'facebook',
                          status_foto: 0,
                          type: 'u',
                          ciudad: 'null'
                        });
                        this.navCtrl.setRoot(TelefonoUserPage, {
                          idUsuario: this.us.uid
                        });
                      } else {
                        console.log('Ya existe telefono manda a tabs');
                        console.log('telefonoelse', data.phoneNumber);
                        localStorage.setItem('telefono', data.phoneNumber);
                        this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
                          uid: this.us.id,
                          displayName: this.us.name,
                          email: this.us.email,
                          photoURL: this.usPhotoUrl,
                          playerID: localStorage.getItem('playerID'),
                          phoneNumber: data.phoneNumber,
                          provider: 'facebook',
                          status_foto: 0,
                          type: 'u',
                          ciudad: data.ciudad
                        });
                      }
                    });
                  } else {
                    this.navCtrl.setRoot(TipoLugarPage);
                  }
                  
                
                  //console.log('telefono',this.telefono);
                });
                // this.navCtrl.setRoot(TabsPage);
                this.navCtrl.setRoot(TipoLugarPage);



                // => Open user session and redirect to the next page
              });
          }
          // An error occurred while loging-in
          else {
            console.log("An error occurred...");
          }
        })
        .catch(error => {
          console.log(error);
          alert("Errores:" + JSON.stringify(error));
          console.log("error de facebook" + JSON.stringify(error));
          
        });
    }
    //  else {

    //   this.afAuth.auth
    //     .signInWithPopup(new firebase.auth.FacebookAuthProvider())
    //     .then(res => {

    //       console.log(res);
    //       let user = res.user;
    //       console.log('Datos User: ', user);
    //       localStorage.setItem('uid', user.uid);
    //       localStorage.setItem("isLogin", 'true');
    //       this.usuarioProv.cargarUsuario(
    //         user.displayName,
    //         user.email,
    //         user.photoURL,
    //         user.uid,
    //         'facebook'
    //       );
    //       if (this.usuarioProv.usuario.uid) {
    //         this.afs.collection('users').doc(this.usuarioProv.usuario.uid).set({
    //           uid: this.usuarioProv.usuario.uid,
    //           displayName: user.displayName,
    //           email: user.email,
    //           photoURL: user.photoURL,
    //           phoneNumber: user.phoneNumber,
    //           provider: 'facebook',
    //           type: 'u'
    //         });
    //       } else {
    //         this.afs.collection('users').add({
    //           uid: this.usuarioProv.usuario.uid,
    //           displayName: user.displayName,
    //           email: user.email,
    //           photoURL: user.photoURL,
    //           phoneNumber: user.phoneNumber,
    //           provider: 'facebook',
    //           type: 'u'
    //         });
    //       }
    //       this.navCtrl.setRoot(TelefonoUserPage, {
    //         idUsuario: this.us.uid
    //       });

    //     });
    // }
  }

  signInWithCorreo(palabra: string) {
    this.navCtrl.setRoot(LoginCorreoPage, { palabra: palabra });
  }

  onReset(palabra: string) {
    this.navCtrl.setRoot(LoginCorreoPage, { palabra: palabra });
  }

  signIn() {
    // this.navCtrl.setRoot(TabsPage);
    this.navCtrl.setRoot(TipoLugarPage);
  }
}
