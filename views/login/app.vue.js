const AppTemplate = `
<div class="campos">
    <div class="col-xs-6 col-sm-6 col-lg-12 col-md-6">
    <input class="e-input" type="text" placeholder="Enter Name" v-model="dados.txtusario">
    </div>
    <div class="col-xs-6 col-sm-6 col-lg-12 col-md-6">
        <div class="e-input-group">
            <input class="e-input" type="password" placeholder="Senha" value="password" v-model="dados.senha">
        </div>
    </div>
    <div class="col-md-12 text-center" style="margin-top: 20px;">
        <ejs-button :isPrimary="true"  v-on:click.native="btnClick">Login</ejs-button>
    </div>
</div>    
`

Vue.component('AppVue',{
    template: AppTemplate,
    data: function(){
        return{
            dados: {
                txtusario: null,
                senha: null
            }
        }
    },

    mounted: function () {
    },
    methods: {
        btnClick(){
            if(this.dados.txtusario == null){
                alert("Preencha o campo Usuario");
                return;
            }else if(this.dados.senha == null){
                alert("Preencha o campo Senha");
                return;
            }
            axios.post(BASE + "/login/login", this.dados).then(res=>{
                    if (res.data.codigo == 1) {
                        alert(res.data.texto);
                        window.location.href = BASE + "/index"
                    } else if (res.data.codigo == 0) {
                        alert(res.data.texto);
                    } else {
                        alert("Erro")
                    }
            })
        }
    }
})