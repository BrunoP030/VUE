const AppTemplate = `
<div class="campos" style="margin-top: 60px;">
    <div class="col-xs-6 col-sm-6 col-lg-6 col-md-6">
        <div class="e-input-group">
            <ejs-textbox floatLabelType="Auto" cssClass="e-outline" :enabled="enableTxt" v-model="dados.txtnome" placeholder="Nome"></ejs-textbox>
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-lg-6 col-md-6">
        <div class="e-input-group">
            <ejs-textbox floatLabelType="Auto" cssClass="e-outline" :enabled="enableTxt" v-model="dados.txtusuario" placeholder="Usuario"></ejs-textbox>
        </div>
    </div>
    <div class="col-xs-6 col-sm-6 col-lg-12 col-md-6">
        <div class="col-md-6">
              <ejs-textbox type= "password" floatLabelType="Auto" cssClass="e-outline" :enabled="enableTxt" v-model="dados.senha" placeholder="Senha"></ejs-textbox>
        </div>
    </div>
    <div class="col-lg-12" style="height: 350px">
        <div id='content' style="margin: 0 auto; width:250px; padding-top: 30px; margin-left: 20px;">
            <ejs-dropdownlist v-model="dados.nivel" :fields="{value: 'codigo', text: 'nivel'}" :dataSource='nivelData' :popupHeight='height' :placeholder='waterMark'></ejs-dropdownlist>
        </div>
    </div>
    <div class="col-md-12 text-center" style="margin-top: -230px;">
        <ejs-button :isPrimary="true" v-if="enableTxt == true" v-on:click.native="btnClick">Cadastrar</ejs-button>
    </div>
    <div>
        <ejs-button cssClass="e-outline" v-if="enableTxt == false" v-on:click.native="btnAt" :isPrimary="true">Atualizar</ejs-button>
    </div>
    <div class="control-section" style="margin-top: 5%">
    <div class="row">
        <div class="col-md-12">
            <ejs-grid
                ref="grid"
                :dataSource="dataSourceList"
                :toolbar="toolbar"
                :toolbarClick="toolbarClick"
                :allowPaging="true"
                :allowSorting="true"
                :pageSettings="{ pageSizes: true, pageSize: 5 }"
                :searchSettings="{ ignoreCase: true, ignoreAccent: true }">
                <e-columns v-model="tabela">
                    <e-column field="id" textAlign="Center" headerText="Usuario"></e-column>
                    <e-column field="nome" textAlign="Center" headerText="Nome"></e-column>
                    <e-column field="nivel" textAlign="Center" headerText="Nivel"></e-column>
                </e-columns>
            </ejs-grid>
        </div>
    </div>
</div>    
</div>
`
Vue.component('AppVue',{
    template: AppTemplate,

    data: function(){

        return{
            tabela: [],
            nivelData: [],
            dados: {
                txtnome: null,
                txtusuario: null,
                senha: null,
                nivel: null
            },
            dataSourceList: [],
            modalHeader: null,
            modalButtons: null,
            disable: false,
            waterMark: 'Selecione o Nivel de Usuario',
            height: '220px',
            nivelData: null,
            acao: null,
            enableTxt: true,
            toolbar: [
                "Search",
                {
                    text: "Editar",
                    toolGrupoText: "edit",
                    prefixIcon: "fas fa-edit",
                    id: "edit",
                }
                ]
        }
    },
    methods: {
        toolbarClick(args) {
            this.acao = args.item.id

            if (this.acao == 'edit') {
                if(this.$refs.grid.getSelectedRecords().length == 0){
                    alert("Selecione um item na tabela");
                    return;
                }
                else if (this.$refs.grid.getSelectedRecords().length > 0){
                    this.enableTxt = false;
                    let data = this.$refs.grid.getSelectedRecords();

                    this.dados.nivel = data[0].nivel;

                    this.dados.txtnome = data[0].nome

                    this.dados.txtusuario = data[0].id;

                    this.disable = false
                    this.modalButtons = [
                        {
                            click: this.edit,
                            buttonModel: {content: '<i class="fas fa-plus"></i>&nbsp&nbspConfirmar'}
                        },
                    ]
                }
            }

        },
        btnClick() {
            axios.post(BASE + "/cadastro/cadastro", this.dados).then(res=>{
                if(res.data.codigo==1){
                    alert(res.data.texto);
                }else if(res.data.codigo==0){
                    alert(res.data.texto);
                }else{
                    alert("Erro")
                }
            })
        },
        getLvl(){
            axios.post(BASE + "/cadastro/getLvl", this.dados.nivel).then(res=>{
                this.nivelData = res.data.data
            })
        },
        lista(){
            axios.post(BASE + "/cadastro/lista").then((res)=>{
                this.dataSourceList = res.data.data
            })
        },
        edit(){
            axios.post(BASE + "/cadastro/edit", this.dadosManipulando).then(res =>{
                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.lista();
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }

            });
        },
        btnAt(){
            axios.post(BASE + "/cadastro/editar", this.dados).then(res =>{

                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.lista();
                    this.enableTxt = true;
                    this.dados={
                        txtnome: null,
                        txtusuario: null,
                        senha: null,
                        nivel: null
                    }
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }
            });
        }
    },
    mounted: function () {
        this.getLvl()
        this.lista()
    },
})