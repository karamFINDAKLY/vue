Vue.config.devtools = true

var eventBus = new Vue()
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: ` <div class="product">
            <div class="product-image">
                <img v-bind:src="image">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">Disponible</p>
                <p v-else>Ce produit n'est pas disponible</p>
                <p> Livraison: {{ Shipping }} </p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
                <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                    :style="{backgroundColor: variant.variantColor }" @click="updateProduct(index)">
                </div>
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock}"> Ajouter au panier
                    </button>
             
            </div>
            <product-tabs :reviews="reviews">   </product-tabs>

                </div>`,

    data() {
        return {
            product: 'Chemise',
            brand: 'Nike',
            selectedVariant: 0,
            details: ["80% coton", "20% polyester", "Neuter de genre", "Taille : s", "Prix : 67.99$"],
            variants: [{
                    variantId: 2234,
                    variantColor: "black",
                    variantImage: './assets/vmSocks-blue2.jpg',
                    variantQuantity: 0
                },
                {
                    variantId: 2235,
                    variantColor: "#A9D0F5",
                    variantImage: './assets/vmSocks-blue1.jpg',
                    variantQuantity: 1


                }
            ],
            reviews: []

        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        }
     


    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {

            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        Shipping() {
            if (this.premium) {
                return "gratuite"
            }
            return "2.99€"
        }
    },
    mounted(){
        eventBus.$on('review-submitted',productReview =>{
            this.reviews.push(productReview)

        })
    }

})

Vue.component('product-review', {
    template: `
     <form class="review-form" @submit.prevent="onSubmit">
         <p v-if="errors.length">
      <b>Veuillez corriger l'erreur(s) suivante:</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>
      <p>
        <label for="name">Nom:</label>
        <input id="name" v-model="name" placeholder="Nom">
      </p>
      
      <p>
        <label for="review">Commentaire:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Avis:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Soumettre">  
      </p>    
    
    </form>
  `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []

        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Nom obligatoire.")
                if (!this.review) this.errors.push("Commentaire obligatoire.")
                if (!this.rating) this.errors.push("Avis obligatoire.")
            }
        },
        
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
          type: Array,
          required: true
        }
      },
    template: `
      <div>
        <span class="tab"
        :class="{activeTab: selectedTab === tab}"
         v-for="(tab, index) in tabs" 
         :key="index" @click="selectedTab = tab"
         >{{ tab }}</span>
         <div v-show="selectedTab ==='Commentaires'">
         <p v-if="!reviews.length">Il n'y a pas encore des commentaires .</p>
         <ul v-else>
         <li v-for="(review, index) in reviews" :key="index">           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
         </div>
         <product-review v-show="selectedTab === 'Faire un commentaire'"
        ></product-review>
         </div>
         
    `,
    data() {
      return {
        tabs: ['Commentaires', 'Faire un commentaire'],
        selectedTab: 'Commentaires'
      }
    }
  })



var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }



})


