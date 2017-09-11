// // import Slideout from 'slideout'

// // var slideout = new Slideout({
// //   'panel': document.querySelector('.body-content-wrapper'),
// //   'menu': document.querySelector('#menu'),
// //   'padding': 256,
// //   'tolerance': 70
// // });

// // document.querySelector('.sidenav-button-toggle')
// //   .addEventListener('click', function () {
// //     document.documentElement.classList.toggle('sidenav-opened')
// //   })

// import debounce from 'debounce'

// // move elements depending on the viewport size!
// const menuInside = document.querySelector('.menu-inside')
// const menuOutside = document.querySelector('.menu-outside')

// function moveOutside () {
//   while (menuInside.children.length) {
//     menuOutside.appendChild(menuInside.removeChild(menuInside.firstChild))
//   }
// }

// function moveInside () {
//   while (menuOutside.children.length) {
//     menuInside.appendChild(menuOutside.removeChild(menuOutside.firstChild))
//   }
// }

// let isOutside
// function move () {
//   const newOutside = window.matchMedia('(max-width: 1200px)').matches
//   console.log(`max-width: 1200 =  ${newOutside}`)
//   if (newOutside !== isOutside) {
//     isOutside = newOutside
//     if (newOutside) {
//       moveOutside()
//     } else {
//       moveInside()
//     }
//   }
// }

// move()
// document.addEventListener('resize', debounce(move))
