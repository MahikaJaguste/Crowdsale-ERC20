// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AB {
    event HelloAB(string name);

    function foo() public virtual {
        emit HelloAB("Inside AB");
    }
}

contract A is AB {
    event HelloA(string name);
    
    function foo() public virtual override {
        emit HelloA("Inside A");
        super.foo();
        emit HelloA("After Inside A");
    }
}

contract B is AB {
    event HelloB(string name);
    
    function foo() public virtual override {
        emit HelloB("Inside B");
        super.foo();
        emit HelloB("After Inside B");
    }
}

contract C is AB {
    event HelloC(string name);
    
    function foo() public virtual override {
        emit HelloC("Inside C");
        super.foo();
        emit HelloC("After Inside C");
    }
}

contract D is A, C, B {
    event HelloD(string name);
    
    function foo() public override(A,B,C) {
        emit HelloD("Inside D");
        super.foo();
        emit HelloD("After Inside D");
    }
}