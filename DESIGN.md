# Design

## Math rendering

- katex
  - pros: faster than mathjax v2
  - cons: not complete like mathjax, e.g. missing macros and refs. Can't use it because of this
- mathjax 3 (svg vs chtml)
  - chtml: works fine in desktop, in mobile some characters are cut off
    - Used this but the mobile issue cannot be ignored
  - svg: issue following eqref, on click the equation referenced is cut but only in desktop
    - The above is an unsolved issue, but it's better than the chtml issue in mobile
