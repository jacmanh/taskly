import { InputHTMLAttributes } from 'react'
import styles from './Field.module.css'

type FieldProps = InputHTMLAttributes<HTMLInputElement>

export const Field = (props: FieldProps) => {
  return <input type={props.type} className={styles.field} {...props} />
}
