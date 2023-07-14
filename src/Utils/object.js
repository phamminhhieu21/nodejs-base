"use strict";
import _ from 'lodash';
export const getInfoData = ({ fields = [], objectData = {}}) => {
    return _.pick(objectData, fields);
}