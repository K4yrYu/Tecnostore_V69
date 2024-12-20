import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/services/service-bd.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const alertControllerMock = jasmine.createSpyObj('AlertController', ['create']);
    const toastControllerMock = jasmine.createSpyObj('ToastController', ['create']);
    const serviceBDMock = jasmine.createSpyObj('ServiceBDService', [
      'actualizarEstadoUsuario3',
      'validarUsuario',
      'actualizarEstadoUsuario',
    ]);

    // Mock para `actualizarEstadoUsuario3`
    serviceBDMock.actualizarEstadoUsuario3.and.returnValue(Promise.resolve());

    // Mock para `validarUsuario`
    serviceBDMock.validarUsuario.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AlertController, useValue: alertControllerMock },
        { provide: ToastController, useValue: toastControllerMock },
        { provide: ServiceBDService, useValue: serviceBDMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('debe validar el formato de contraseña durante el inicio de sesión', async () => {
    // Caso: Contraseña inválida
    component.email = 'valid@example.com'; // Email válido
    component.password = 'short'; // Contraseña corta y sin requisitos
    spyOn(component, 'presentAlert'); // Espía para verificar que se muestra la alerta
  
    await component.onLogin();
  
    expect(component.presentAlert).toHaveBeenCalledWith(
      'La contraseña debe tener al menos 6 caracteres, una mayúscula, un número y un carácter especial.'
    );
  });
  
  
});

