# OB.JS

### A typescript library for low-level javascript objects features

#### Demo

###### Snapshots:
- [Test the Snapshotter here](https://jsfiddle.net/phyjaen/gam098xh/)
  - Create snapshot with `save` and restore previous one with `revert` button
  - The default snapshots queue length is set to 7, subsequent saves will start overwriting older ones
  - Behaviour can be changed with configuration options in the constructor
Script :
<script async src="//jsfiddle.net/phyjaen/gam098xh/embed/js,html,result/"></script>
Frame:
<iframe width="100%" height="300" src="//jsfiddle.net/phyjaen/gam098xh/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


#### History

###### v0.0.2:
- Objects snapshots :
  - Add features to check presence and or count snapshots for a given object
  - Fix some minor issues
- Cloning objects :
  - Allow to perform deep or shallow clone assignation from a given source to a given target
- Builds :
  - Fix wrong reference to map file in minified js file


###### v0.0.1:
- Cloning objects :
  - Create deep or shallow clones of given objects with handling of references cycles and original prototype instance
- Objects snapshots :
  - Create snapshots for objects to easily revert them to any previously saved states
- Types utilities :
  - Handy shortcut methods for checking/comparing objects types or definition states
 
 
