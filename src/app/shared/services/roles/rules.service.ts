import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utility, host } from '../../site-variable';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

  private getRulesEndpoint = 'role/get_rules/'
  private deleteRulesEndpoint = 'role/delete_rule/'
  private deleteUserFromRuleEndpoint = 'role/remove_user_from_rule/'
  private addRuleEndpoint = 'role/add_rule/'
  private getRuleUsersEndpoint = 'role/get_rule_users/'
  private addUsersToRuleEndpoint = 'role/add_user_to_rule/'
  private editRuleEndpoint = 'role/edit_rule/'
  private getITTUsersEndpoint = 'role/get_itt_users/'
  private getAllRulesEndpoint = 'role/get_all_rules/'

  constructor(private _httpClient: HttpClient, public utility: Utility) { }

  getRules(){
    return this._httpClient.get(host+this.getRulesEndpoint, {headers: this.utility.getHeaders()})
  }

  getAllRules(){
    return this._httpClient.get(host+this.getAllRulesEndpoint, {headers: this.utility.getHeaders()})
  }

  deleteRule(body){
    return this._httpClient.delete(host + this.deleteRulesEndpoint, {body: body, headers: this.utility.getHeaders()})
  }

  deleteUserFromRule(body){
    return this._httpClient.post(host + this.deleteUserFromRuleEndpoint, body, { headers: this.utility.getHeaders()})
  }

  addRule(body){
    return this._httpClient.post(host + this.addRuleEndpoint, body, {headers: this.utility.getHeaders()})
  }

  editRule(body){
    return this._httpClient.post(host + this.editRuleEndpoint, body, {headers: this.utility.getHeaders()})
  }
  
  getRuleUsers(params){
    let queryParams = new HttpParams()
    queryParams = queryParams.append('rule_id', params['rule_id'])
    return this._httpClient.get(host + this.getRuleUsersEndpoint, {params: queryParams, headers: this.utility.getHeaders()})
  }

  addUserToRule(body){
    return this._httpClient.post(host+this.addUsersToRuleEndpoint, body, {headers: this.utility.getHeaders()})
  }

  getITTUsers(){
    return this._httpClient.get(host + this.getITTUsersEndpoint, {headers: this.utility.getHeaders()})
  }
}
