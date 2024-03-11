<template>
    <div>
      <v-layout row justify-center>
     <v-flex xs12 ms12 md12 lg12>
      <v-card
     class="mx-auto"
     outlined
      >
     <v-card outlined> <v-card-title>{{ $t("Order-page") }}</v-card-title></v-card>
      <v-card-text align-baseline>       
       <p>{{ $t("internal-file") }} <em>{{$t("reconciliation")}}</em>,<em>{{$t("tna")}}</em>,
       <em>{{$t("generating-qr-codes")}}</em>
        , <em>{{$t("addNew")}}</em> {{$t("and")}} <em>{{$t("order-status-qr-code")}}</em>.
       </p>
        <p>
          <ul>
             <h3>{{$t("reconciliation")}}:</h3>
            <li> {{$t("get-reconciliation-order")}}  </li>
            </ul>
            <ul>
             <h3>{{$t("tna")}}:</h3>
            <li>{{$t("get-time-action")}}</li>
            </ul>
            <ul>
             <h3>{{$t("order-status-qr-code")}}</h3>
            <li>{{$t("gnerate-reconcilation-time-action")}}</li>
            </ul>
            <ul>
             <h3>{{$t("addNew")}}:</h3>
            <li>{{$t("register-new-order")}}</li>
            </ul>
            <ul>
          <h3>{{$t("order-status-qr-code")}}:</h3>
            <li>{{$t("generate-order-status-for-Qrcode")}}</li>
            </ul>
            </p>
            
      </v-card-text>     
      <v-card-text     
      align-baseline>
        <p>
          <ul>
            <h3>{{$t("add-ne-order-page")}}</h3>
              <li>
               {{$t("add-all-field")}}
              </li>
              <li>
                {{$t("compute-size-color")}}
              </li>
                <li>
               {{$t("compute-size-color-ratio")}}
              </li>
              <li>
              <p>{{$t("attachment-action")}}</p>
                 <p>{{$t("viewfile")}}</p>
                 <p>{{$t("moredetail-edit-orderstatus-delete")}}</p>
              </li>
          </ul>
         </p>
        </v-card-text>     

    <v-card-text     
      align-baseline>
        <p>
          <ul>
            <h3>{{$t("order-status")}}</h3>
              <li>
            {{$t("Status-Summery-number-register")}}              
            </li>
              <li>
              <p>{{$t("addnew-register-new-order-status")}}</p> 
                  <p>{{$t("fill-all-in-step")}}</p>
              </li>
                <li>
                    <p>{{$t("nter-color-and-save")}}</p> 
              </li>
              <li>
              <p>{{$t("search-color-size")}}</p>
              </li>
          </ul>
         </p>
        </v-card-text>
      </v-card>
    </v-flex>
</v-layout>
</div>
</template>