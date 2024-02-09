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
                    <e-column field="data" textAlign="Center" headerText="Data"></e-column>
                    <e-column field="tipolanc" textAlign="Center" headerText="Tipo Lancamento"></e-column>
                    <e-column field="descricao" textAlign="Center" headerText="Fluxo"></e-column>
                    <e-column field="valor" textAlign="Center" headerText="Valor"></e-column>
                    <e-column field="obs" textAlign="Center" headerText="Obs"></e-column>
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
                    <div class="col-md-8">
                        <ejs-dropdownlist 
                            v-model="dadosManipulando.DROPTIPO"
                            cssClass="e-outline"
                            :dataSource='lancTipo'
                            ref="tipoLanc"
                            :fields="{value:'sequencia', text:'tipolanc'}"
                            placeholder='Tipo do Lançamento*'>
                        </ejs-dropdownlist>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <ejs-textbox 
                        floatLabelType="Auto"
                        v-model="dadosManipulando.VALOR"
                        cssClass="e-outline" 
                        placeholder="Valor*">
                    </ejs-textbox>
                    </div>
                    <div class="col-md-2">
                        <ejs-dropdownlist 
                        floatLabelType="Auto"
                            v-model="dadosManipulando.DROPFLUXO"
                            cssClass="e-outline"
                            :fields="{ value:'codigo', text:'descricao'}"
                            :dataSource='fluxoData'
                            ref="dropfluxo"
                            placeholder='Fluxo*'>
                        </ejs-dropdownlist>
                    </div>
                    <div class="col-md-2">
                        <ejs-textbox 
                            floatLabelType="Auto" 
                            v-model="dadosManipulando.OBS"
                            ref="obs"
                            cssClass="e-outline"
                            placeholder='Observações'>
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
            lancTipo: [],
            fluxoData: [],
            dadosManipulando: {
              DROPTIPO: null,
              VALOR: null,
              DROPFLUXO: null,
              OBS: null
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
                    prefixIcon: "fas fa-edit",
                    id: "edit",
                },
                {
                    text: "Excluir",
                    toolGrupoText: "del",
                    prefixIcon: "fas fa-trash",
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
            this.dadosManipulando={
                DROPTIPO: null,
                VALOR: null,
                DROPFLUXO: null,
                OBS: null
            }
            this.$refs.modal.hide();
        },
        toolbarClick: function (args) {
            if (args.item.id == 'add') {
                this.disable = false;
                this.abrirModal();
                this.modalHeader = "Lançamento";
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

                    this.dadosManipulando.VALOR = data[0].valor

                    this.dadosManipulando.DROPTIPO = data[0].tipo;

                    this.dadosManipulando.DROPFLUXO = data[0].fluxo
                    this.dadosManipulando.OBS = data[0].obs




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
                    let mostrando = data[0].obs
                    dadosManipulando=data[0].sequencia

                    if ( confirm(`Tem certeza que deseja excluir "${mostrando}"`)){
                        axios.post(BASE + "/lancamentos/del", dadosManipulando).then(res=>{
                            this.$refs.grid.dataSourceList = [];

                            if (res.data.codigo == 1){
                                alert(res.data.texto);
                                this.relatorio();
                            } else if (res.data.codigo == 0){
                                alert(res.data.texto);
                            } else {
                                alert("erro");
                            }
                        });
                        return;
                    }else{
                        alert("Exclusão do registro cancelada");
                    }
                }
            }
        },

        relatorio(){
            this.tabela=""
            axios.post(BASE + "/lancamentos/relatorio").then((res)=>{
                this.dataSourceList = res.data
            })
        },

        btnConfirm(){
            if(this.dadosManipulando.DROPFLUXO == null){
                alert("Selecione o tipo de Fluxo");
                return;
            }else if(this.dadosManipulando.DROPTIPO == null){
                alert("Selecione o tipo de lançamento");
                return;
            }else if(this.dadosManipulando.VALOR == null){
                alert("Preencha o valor");
                return;
            }
            axios.post(BASE + "/lancamentos/lancamento", this.dadosManipulando).then(res =>{
                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.relatorio();
                    this.fecharModal();
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }
            })
        },

        edit(){
            axios.post(BASE + "/lancamentos/edit", this.dadosManipulando).then(res =>{
                if(res.data.codigo == 1){
                    alert(res.data.texto);
                    this.relatorio();
                    this.fecharModal();
                }else if(res.data.codigo == 0){
                    alert(res.data.texto);
                }else{
                    alert("Erro");
                }

            });
        },

        getTplanc: function(){
            axios.post(BASE + "/lancamentos/getTplanc", this.dadosManipulando.DROPTIPO).then(res=> {
                this.lancTipo = res.data.data;
            })
        },
        getTpfluxo: function(){
            axios.post(BASE + "/lancamentos/getTpfluxo", this.dadosManipulando.DROPFLUXO).then(res=> {
                this.fluxoData = res.data.data;
            })
        },
        get_lvl(){
            axios.post(BASE + "/lancamentos/get_lvl").then(res=>{
                if(res.data.lvl == 3){
                    this.toolbar = [
                        "Search",
                        {
                            text: "Adicionar",
                            toolGrupoText: "add",
                            prefixIcon: "fas fa-plus",
                            id: "add",
                        }
                    ]
                }
            })
        }
    },
    mounted: function () {
        this.get_lvl();
        this.relatorio();
        this.getTplanc();
        this.getTpfluxo();
    },
})