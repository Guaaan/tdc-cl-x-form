import { useRef, useState } from 'react'
import { useForm, $Form, $Number, $Text, $Password, $Button, optional, Valid, Invalid, CustomField, $Select } from '@tdc-cl/x-form';
import './MySignUpFormComponent.css'



function MySignUpFormComponent() {
    const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const nameRegex =  /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    const reRef = useRef()

    const $Email = CustomField.extends($Text).with({
        validate(value) {
          if (!emailRegex.test(value)) {
            return Invalid('Email Invalido');
          }
    
          return Valid(value);
        }
      });
    
    const $FullName = CustomField.extends($Text).with({
        validate(value) {
          if (!nameRegex.test(value)) {
            return Invalid('Valor invalido, solo utilizar letras');
          }
    
          return Valid(value);
        }
      });

    const $Age = CustomField.extends($Number).with({
        validate(value) {
          if (!/^(1[89]|[2-9]\d)$/.test(value)) {
            return Invalid('Tienes que ser mayor de edad para registrarte');
          }
    
          return Valid(value);
        }
      });

    const $Pass = CustomField.extends($Password).with({
        validate(value) {
          if (!passRegex.test(value)) {
            return Invalid('Minimo 8 Caracteres, una letra un numero y un caracter especial');
          }
    
          return Valid(value);
        }
      });

    const $RepeatPassword = CustomField.extends($Password).with({
        label: 'Repite la contraseña',
    
        validate(value) {
          const { password } = form.fields;
    
          if (!password.is(value)) {
            return Invalid('Las contraseñas no coinciden');
          }
    
          return Valid(value);
        },
      });

    const [users, setUsers] = useState([])
    const form = useForm($Form({
        fields: {
          first_name: $FullName('Nombre').with({
            placeholder: 'Juan',
            defaulValues: 'Diego'
          }),
          last_name: $FullName('Apellido').with({
            placeholder: 'Rod',
          }),
          age: $Age('Edad').with({
            placeholder: '+18',
          }),
          num_children: optional($Number('Nro Hijos')).with({
            placeholder: 'Numero de hijos',
          }),
          gender: $Select('Genero').with({
            blankOption: "Género",
            options: [
              { value: 'F', label: 'Femenino' },
              { value: 'M', label: 'Masculino' },
              { value: 'X', label: 'Otro' },
            ]
          }),
          gender_specify: $Text('Especifique').with({
            placeholder: 'Especifique Genero',
          }).showIf(_ => _.gender
            .is('Otro')),
    
          email: $Email('Email').with({
            placeholder: 'Correo Electronico',
          }),
          password: $Pass('Contraseña').with({
            placeholder: 'Contraseña',
          }),
          repeatPass: $RepeatPassword('Repetir Contraseña').with({
            placeholder: 'Repetir Contraseña',
          }),
        },
    
        submit: $Button('Crear Cuenta', {
          async onValid(values) {
            console.log(values);
    
            //const token = await reRef.current.getValue()
    
            const res = await fetch('http://localhost:3000/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              
              body: JSON.stringify({
                first_name: values.first_name,
                last_name: values.last_name,
                age: values.age,
                num_children: values.num_children,
                gender: values.gender,
                gender_specify: values.gender_specify,
                email: values.email,
                password: values.password,
                fav_color: values.fav_color,
                //token: token,
              })
            })
            const data = await res.json()
    
            setUsers([...users, data])
            if (res.status < 200 || res.status > 299) {
              if (res.status > 399 || res.status < 499) {
                alert(`Ha ocurrido un error en tu registro, status:${res.status}`)
              }
            } else {
              alert(`Usuario Registrado Exitosamente, status:${res.status}`)
              console.log(`Sstatus:${res.status}`)
              window.location.reload()
            }
    
    
          },
          onInvalid: 'enable',
        }),
    
    
      }));
    

    return form.render();
    
}

export default MySignUpFormComponent;