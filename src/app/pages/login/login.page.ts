import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/services/service-bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = ''; 
  password: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private dbService: ServiceBDService
  ) {}

  async ngOnInit() {
    this.vaciarCampos();
    await this.dbService.actualizarEstadoUsuario3();
  }

  async onLogin() {
    // Validación del correo y contraseña
    if (!this.validarCorreo(this.email.trim())) {
      await this.presentAlert('El correo debe contener un único @.');
      return;
    }

    if (!this.validarContrasena(this.password.trim())) {
      await this.presentAlert('La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.');
      return;
    }

    // Verificar las credenciales en la base de datos
    try {
      const usuario = await this.dbService.validarUsuario(this.email, this.password);
      if (usuario) {
        await this.dbService.actualizarEstadoUsuario(this.email);
        this.router.navigate(['/perfil']); 
        this.vaciarCampos();
        await this.presentToast('Inicio de sesión exitoso');
      } else {
        this.vaciarCampos();
        await this.presentAlert('Usuario o contraseña incorrectas');
      }
    } catch (error) {
      this.vaciarCampos();
      console.error('Error al iniciar sesión:', error);
      await this.presentAlert('Error al verificar las credenciales.');
    }
  }

  vaciarCampos(){
  this.email = ''; 
  this.password = '';
  }

  validarCorreo(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const atSymbolCount = email.split('@').length - 1;
    return emailPattern.test(email) && atSymbolCount === 1;
  }

  validarContrasena(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*\W)[A-Za-z\d\W]{6,}$/;
    return passwordPattern.test(password);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  irPagina() {
    this.router.navigate(['/signup']);
  }
}
