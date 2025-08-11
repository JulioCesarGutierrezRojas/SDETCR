import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import RequestEmailComponent from '../components/RequestEmailComponent'
import VerifyTokenComponent from '../components/VerifyTokenComponent'
import ChangePasswordComponent from '../components/ChangePasswordComponent'
import styles from '../../../styles/form-login.module.css'

const PasswordRecoveryForm = () => {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [user, setUser] = useState(null)

  return (
    <div className={styles.container} style={{backgroundColor: 'var(--white)'}}>
      <div className={styles.leftPanel} style={{
        background: 'linear-gradient(135deg, var(--color-lavanda-500), var(--color-nude-500))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center', color: 'var(--white)'}}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'var(--secondary)'
          }}>SDETCR</h1>
          <p style={{fontSize: '1.2rem'}}>Simulador de Entrevistas Laborales con Retroalimentación</p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.form} style={{maxWidth: '450px'}}>
          <h2 className={styles.title}>Restablecer Contraseña</h2>
          <p className={styles.subtitle}>
            {step === 1 && 'Ingresa tu correo para comenzar'}
            {step === 2 && 'Verifica tu identidad'}
            {step === 3 && 'Crea una nueva contraseña'}
          </p>

          {/* Indicador de pasos */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '0.5rem'
          }}>
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepNumber ? 'var(--primary)' : 'var(--blue)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div style={{
                    width: '30px',
                    height: '2px',
                    backgroundColor: step > stepNumber ? 'var(--primary)' : 'var(--blue)'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && <RequestEmailComponent email={email} setEmail={setEmail} setStep={setStep} />}
          {step === 2 && <VerifyTokenComponent email={email} token={token} setToken={setToken} setStep={setStep} setUser={setUser}/>}
          {step === 3 && <ChangePasswordComponent email={email} token={token} setStep={setStep} user={user}/>}

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            borderTop: '1px solid #eee',
            paddingTop: '1.5rem'
          }}>
            <Link to="/" style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordRecoveryForm
