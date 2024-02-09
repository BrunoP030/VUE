const AppTemplate = `

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
                <e-columns v-model="tabela" >
                    <e-column field="sequencia" textAlign="Center" headerText="Sequencia"></e-column>
                    <e-column field="descricao" textAlign="Center" headerText="Descrição"></e-column>
                </e-columns>
            </ejs-grid>
        </div>
    </div>
    
    <div class="row">
        <div class="col-md-12">
            <ejs-dialog
                isModal="true"
                :header="modalHeader"
                :buttons="modalButtons"
                :open="(args) => {args.preventFocus = false;} /*tirar o foco do botão primário do modal*/"
                ref="modal"
                v-bind:visible="false"
                :animationSettings="{ effect: 'Zoom' }"
                :showCloseIcon='false'
                :closeOnEscape="false"
                target='body'
                width="900px">
                <div class="row" style="margin-top: 10px;">
                    <div class="col-md-6">
                <div class="row">
                    <div class="col-md-6">
                        <ejs-textbox 
                        floatLabelType="Auto"
                        v-model="dadosManipulando.DESCRICAO"
                        cssClass="e-outline" 
                        placeholder="Descrição*">
                    </ejs-textbox>
                    </div>
                </div>
            </ejs-dialog>
        </div>
    </div>
</div>

`;
Vue.component('AppVue',{
    template: AppTemplate,

    data: function(){

        return{
            tabela: [],

            dadosManipulando: {
                DESCRICAO: null
            },
            dataSourceList: [],
            modalHeader: null,
            modalButtons: null,
            disable: false,
            toolbar: [
                "Search",
                {
                    text: "Adicionar",
                    toolGrupoText: "add",
                    prefixIcon: "fas fa-plus",
                    id: "add",
                },
                {
                    text: "Editar",
                    toolGrupoText: "edit",
                    prefixIcon: "fa fa-edit",
                    id: "edit",
                },
                {
                    text: "Excluir",
                    toolGrupoText: "del",
                    prefixIcon: "fa fa-trash",
                    id: "del",
                }
            ]
        }
    },


    methods: {
        abrirModal(){
            this.$refs.modal.show();
        },
        fecharModal(){
            this.dadosManipulando= {
                DESCRICAO: null
            }
            this.$refs.modal.hide();
        },
        toolbarClick: function (args) {
            if (args.item.id == 'add') {
                this.disable = false;
                this.abrirModal();
                this.modalHeader = "Tipo Lançamento";
                this.modalButtons = [
                    {
                        click: this.fecharModal,
                        buttonModel: {content: '<i class="fas fa-times-circle"></i>&nbsp&nbspFechar'}
                    },
                    {
                        click: this.btnConfirm,
                        buttonModel: {content: '<i class="fas fa-plus"></i>&nbsp&nbspConfirmar'}
                    },
                ];
            }else if(args.item.id == 'edit'){
                if(this.$refs.grid.getSelectedRecords().length ==0){
                    alert("Selecione um item na tabela");
                    return;
                }
                if (this.$refs.grid.getSelectedRecords().length > 0){
                    this.abrirModal();

                    let data = this.$refs.grid.getSelectedRecords();
                    this.dadosManipulando.SEQUENCIA = data[0].sequencia;
                    console.log(data);

                    this.dadosManipulando.DESCRICAO = data[0].descricao;




                    this.disable = false;
                    this.modalHeader = "Tipo Lançamento";
                    this.modalButtons = [
                        {
                            click: this.fecharModal,
                            buttonModel: {content: '<i class="fas fa-times-circle"></i>&nbsp&nbspFechar'}
                        },
                        {
                            click: this.edit,
                            buttonModel: {content: '<i class="fas fa-plus"></i>&nbsp&nbspConfirmar'}
                        },
                    ];

                }
            } else if(args.item.id == 'del'){
                if (this.$refs.grid.getSelectedRecords().length > 0){

                    let data = this.$refs.grid.getSelectedRecords()
                    let mostrando = data[0].descricao
                    dadosManipulando=data[0].sequencia

                           if ( confirm(`Tem certeza que deseja excluir "${mostrando}"`)){
                               axios.post(BASE + "/tipo_lancamento/del", dadosManipulando).then(res=>{
                                   this.$refs.grid.dataSourceList = [];

                                   if (res.data.codigo == 1){
                                       alert(res.data.texto);
                                       this.lista();
                                   } else if (res.data.codigo == 0){
                                       alert(res.data.texto);
                                   } else {
                                       alert("erro");
                                   }
                               });


                           }

                }
            }
        },
        lista(){
            axios.post(BASE + "/tipo_lancamento/lista").then((res)=>{
                this.dataSourceList = res.data.data
            })
        },
        btnConfirm(){
            if(this.dadosManipulando.DESCRICAO == null){
                alert("Preencha a descrição");
                return;
            }
            axios.post(BASE + "/tipo_lancamento/insert", this.dadosManipulando).then(res=>{
                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.lista()
                    this.fecharModal()
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }
            })
        },
        edit(){
            axios.post(BASE + "/tipo_lancamento/edit", this.dadosManipulando).then(res =>{
                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.lista();
                    this.fecharModal();
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }

            });
        },
    },
    mounted: function () {
        this.lista();
    },
})