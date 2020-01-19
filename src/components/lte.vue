<template>
  <div class="wrapper" >
    <Aheader :user-name="username"></Aheader>
    <Amenu :user-name="username"></Amenu>
    <Acontent></Acontent>
    <Afooter></Afooter>
  </div>
</template>

<script>
    import Aheader from './adminlte_header'
    import Amenu from './adminlte_menu'
    import Afooter from './adminlte_footer'
    import Acontent from './adminlte_content'

    export default {
        name: "lte",
        data(){
            return{
                username: ''
            }
        },
        mounted() {
            document.getElementsByTagName("body")[0].className="hold-transition ";
            document.getElementsByTagName("body")[0].className+="skin-blue ";
            document.getElementsByTagName("body")[0].className+="sidebar-mini";
            this.base_data()
        },
        components:{
            Aheader,
            Amenu,
            Afooter,
            Acontent
        },
        methods:{
            base_data(){
                this.$axios.get('/api/user/index-base').then((response) => {
                    this.username = response.data['username']
                })
            }
        },
        beforeDestroy: function() {
            document.body.removeAttribute("class","hold-transition");
            document.body.removeAttribute("class","skin-blue");
            document.body.removeAttribute("class","sidebar-mini");
        },
    }
</script>

<style scoped>

</style>
