import React from 'react';

interface AccountViewProps {
  vars: any;
}

const AccountView: React.FC<AccountViewProps> = (props) => {
  return (
    <div>
      {props.vars['account']}
    </div>
  );
};

export default AccountView;
