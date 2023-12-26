import React, { useEffect, useState } from 'react';

const NextFunction = ({ handleSubmit }: { handleSubmit: any }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count == 0) {
      handleSubmit();
      setCount(1);
    }
  }, [count]);

  return <div></div>;
};

export default NextFunction;
