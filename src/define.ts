import { Dojo } from './types/framework.d';
import { Vughex } from './vughex';

declare const define: any;
declare const ebg: any;

define([
    'dojo',
    'dojo/_base/declare',
    'ebg/core/gamegui',
    'ebg/counter',
    'ebg/stock',
], function (dojo: Dojo, declare: any) {
    return declare('bgagame.vughex', ebg.core.gamegui, new Vughex());
});
