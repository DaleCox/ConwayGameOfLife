ConwayGameOfLife
================

Conway's Game of Life

This is an exploration of both Conway's Game of Life and HTML5 Canvas with Vanilla JavaScript

See an example of the application here: http://dalecox.github.io/ConwayGameOfLife/life.html 

For more on Game of Life see Wikid - http://en.wikipedia.org/wiki/Conway's_Game_of_Life and  http://www.conwaylife.com/wiki/Main_Page 

Brush behavior - 
If single Cell Selected it will toggle the value of the cell. Any other brush selection will result in value being over written.

TODO List:
- Clean up L&F
-- move things into a css file
-- Improve control interface
- Add Color Selection 
-- Let user change the color of life
- Adopt rule Selection as specified here: http://www.conwaylife.com/wiki/Life-like_cellular_automaton#Life-like_cellular_automata 
- Add more brushes
-- allow users to define brushes and store in local storage
- Create some starting seeds 
- May move image path as a property of the brush
- Allow for different cell types to exist on the board 
-- Extend to allow users to define cell type behavior