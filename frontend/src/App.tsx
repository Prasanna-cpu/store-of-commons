import React from 'react';
import {SignInButton, SignUpButton, Show,  UserButton} from "@clerk/react";

const App : React.FunctionComponent = () => {
    return (
        <>
          <header>
            <Show when="signed-out">
              <SignInButton />
              <SignUpButton />
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </header>
        </>
    );
};

export default App ;