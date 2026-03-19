import { useState } from 'react';

const INITIAL_VALUES = {
  username: '',
  password: '',
};

export function useLoginForm() {
  const [values, setValues] = useState(INITIAL_VALUES);

  const updateField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return { values, updateField };
}

