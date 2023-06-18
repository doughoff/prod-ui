import { Status } from '../api';

export type statusOptions = Status | 'ALL';

const statusToStatusList = (status: statusOptions): Status[] => {
  const result: Status[] = [];
  if (status === 'ALL') {
    result.push('ACTIVE', 'INACTIVE');
  } else {
    result.push(status);
  }

  return result;
};

export { statusToStatusList };
