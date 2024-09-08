# Chapter 1. Preface

## Do I need to know how to program?

While it is recommended to know how to program a little bit, I started programming with zero knowledge doing stuff for Fallout 4 with Papyrus, and then moving to GTA:V with C#, and now TypeScript. I believe that the fastest way to learn something is keep trying and failing at it until you fully understand what you are doing.

Programming is a skill, and in order to train that skill you need to put time in to learn. This book is going to act as a way for you as a user without very much programming knowledge, to stumble through and build some plugins.

You'll be able to tweak little bits of code from this book to get a better understanding of what they are doing.

Remember to take breaks, and keep coming back every day to learn a bit more each time.

## What is alt:V?

alt:V is an advanced multiplayer modification framework specifically designed for Grand Theft Auto V (GTA V). It empowers developers to craft custom multiplayer experiences by offering a robust platform and comprehensive API for scripting and extending the game. With alt:V, you can create unique game modes by writing both server-side and client-side code.

## What is Rebar?

Rebar is a plug-and-play base framework for the alternative GTA:V multiplayer client alt:V. Rebar is meant to act as a light framework that provides utility, and a basic standard for building plugins that can be compatible with other plugins. It has a heavy focus on simplifying building game modes and lowering the friction of building a server.

Rebar is the foundational piece necessary to construct large concrete structures. Think of this framework as achieving the same from a game-mode standpoint.

## How do these two come together?

Rebar is built on top of the alt:V JavaScript module, leveraging TypeScript, Node.js, Vue 3, and Tailwind CSS to establish a standardized plugin system. This system encourages developers to create plugins in a specific format, ensuring compatibility across the entire framework. Designed to enhance and expedite the development process, Rebar simplifies the implementation of complex features such as database interactions, world object interactions, and interactive player menus. Rebar streamlines the creation of sophisticated functionalities, making development more efficient and consistent.

If you're familiar with ESX or QBCore, Rebar is the ESX or QBCore equivalent for alt:V.

## Why was Rebar made?

Originally, when I began working on multiplayer frameworks, I created one called OpenRP. It quickly became clear that this framework was struggling due to its mature codebase being written entirely in JavaScript, lacking the type safety provided by TypeScript. After a year, I decided to abandon OpenRP and shift my focus to a new project named Athena.

Athena was developed over three years and underwent numerous iterations, all while incorporating TypeScript for enhanced type safety. Despite reaching a point of stability, Athena faced significant challenges: it was difficult to work with, and plugin developers were reluctant to release open-source content. It became apparent that Athena was not the right framework for its time.

In 2024, I created Rebar in less than two months. Rebar integrated the best aspects of Athena, including its plugin system and Vue 3 SPA support, and significantly enhanced them. This new framework allows for the majority of server development to be done on the server-side, which is crucial for security.

Rebar's design addresses the issues faced by its predecessors, making it a more robust and developer-friendly solution.
