<template>

	<transition name="fade" mode="out-in">

	  <div class="wrap" v-if="isLoaded">
	    <div class="text">

	      <h1>Мои работы</h1>

	    </div>
	    <div id="works">
							
				<div class="options">

					<Tags :tags="tags" @onSelectTag="tag = $event" />
					<Sort @onSort="sort = $event" />    	

				</div>		

	    	<transition-group name="works" tag="ul" mode="out-in" appear>
	    		<Work v-for="work in worksFiltered" :params="work" :key="work.id" />
	    	</transition-group>

	    </div>
	  </div>
	  <div v-else class="load-content">
	  	Загрузка...
	  </div>

	</transition>

</template>


<script>
	import axios from 'axios'
	import Work from './Work'
	import Tags from './Tags'
	import Sort from './Sort'

  export default {
    name: "Works",
    components: {Work, Tags, Sort},
    data() {
      return {
        isLoaded: false,
        works: '',
        sort: 'new',
        tag: ''
      }
    },
    created() {
      this.loadData()
    },
    computed: {
    	tags() {

    		let alltags = []
    		for (var i = 0, l = this.works.length; i < l; i++) {
    			alltags = alltags.concat( this.works[i].tag.replace(/\s/g, "").split(',') )
    		}

    		let tags = alltags.filter((v, i, a) => a.indexOf(v) === i);
				
    		return tags.sort()
    	},

      worksFiltered() {
        //console.log('this.sort - ' + this.sort + ' this.tag - ' + this.tag)
        let filtered = []

        // select via tag
        if (this.tag) {
          for (var i = 0, l = this.works.length; i < l; i++) {
            let tags = this.works[i].tag.replace(/\s/g, "").split(',')

            if ( tags.indexOf(this.tag) != -1 ) {
              filtered.push(this.works[i])
            }
          }
        } else {
          filtered = this.works
        }

        // sorted 
        switch(this.sort) {
          case 'old': 
            filtered.sort(this.compareValues('created'))
            break;
          case 'new': 
            filtered.sort(this.compareValues('created', 'desc'))
            break;
          default:
            filtered.sort(this.compareValues('title'))
        }   
        
        return filtered
      },

    },
    methods: {
      loadData() {

      	const ax = axios.create({
				  baseURL: './works'
				})

				ax.get('works.json')
					.then((resp) => {       
						this.works = resp.data //console.log('this.works', this.works);
            this.isLoaded = true
          })
          .catch((error) => {
          	console.log('error: ' + error)
          })
      },

      compareValues(key, order='asc') {
			  return function(a, b) {
			    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			        return 0; 
			    }

			    const varA = (typeof a[key] === 'string') ? 
			      a[key].toUpperCase() : a[key];
			    const varB = (typeof b[key] === 'string') ? 
			      b[key].toUpperCase() : b[key];

			    let comparison = 0;
			    if (varA > varB) {
			      comparison = 1;
			    } else if (varA < varB) {
			      comparison = -1;
			    }
			    return (
			      (order == 'desc') ? (comparison * -1) : comparison
			    );
			  };
			},

    }

  }
</script>


<style lang="scss" scoped>

	.fade-enter-active {
    transition: all .3s ease;
  }
  .fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

	.works-enter-active {
    transition: transform 250ms ease-out, opacity 250ms ease-out;
  }
  .works-leave-active {
    transition: transform 250ms ease-out, opacity 250ms ease-out;
  }
  .works-enter, .works-leave-to {
		position: fixed;
		left: 33%;
		top: 33%;
		transform: translate(-50%, -50%);
    opacity: 0;
    transform: scale3d(0.001, 0.001, 1);
    transition: transform 250ms ease-out, opacity 250ms ease-out;
  }
  .works-move {
    transition: transform 250ms;
  }

	.load-content {
		text-align: center;
		line-height: 90px;
		height: 90px;
		width: 100%;
		position: fixed;
		top: 50%;
		left: 0;
		margin: -45px 0 0 0;	
	}

</style>