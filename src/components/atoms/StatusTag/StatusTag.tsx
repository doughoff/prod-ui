import { Tag } from 'antd'
import type { Status } from '../../../api'

export interface Props {
  status: Status
  className?: string
}

const StatusTag: React.FC<Props> = ({ status, className }) => {
  if (status === 'ACTIVE') {
    return (
      <Tag className={className} color='green'>
        Activo
      </Tag>
    )
  } else if (status === 'INACTIVE') {
    return (
      <Tag className={className} color='red'>
        Inactivo
      </Tag>
    )
  } else {
    return (
      <Tag className={className} color='gray'>
        No Identificado
      </Tag>
    )
  }
}

export default StatusTag
