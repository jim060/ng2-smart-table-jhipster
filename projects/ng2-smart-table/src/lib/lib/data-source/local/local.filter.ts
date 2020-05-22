export function filterValues(value: string, search: string) {
  return value.toString().toLowerCase().includes(search.toString().toLowerCase());
}

export function filterMulti(value: string, search: string) {
  const listSearch = search.split(';');
  const valCell = value.replace(/ /g, '');
  return (listSearch.toString().toLowerCase().includes(value.toString().toLowerCase()));
}

export function filterDate(value: Date, search: string) {
  if (search.startsWith('_date_before_')) { // Before
    const beforeDateStr = search.substring('_date_before_'.length);
    const beforeDate = new Date(beforeDateStr);
    beforeDate.setHours(0, 0, 0, 0);
    return value <= beforeDate;
  } else if (search.startsWith('_date_after_')) { // After
    const afterDateStr = search.substring('_date_after_'.length);
    const afterDate = new Date(afterDateStr);
    afterDate.setHours(0, 0, 0, 0);
    return value >= afterDate;
  } else if (search.startsWith('_date_equal_')) { // Egual stricte
    const equalsDateStr = search.substring('_date_equal_'.length);
    const equalsDate = new Date(equalsDateStr);
    equalsDate.setHours(0, 0, 0, 0);
    return value.getTime() === equalsDate.getTime();
  } else if (search.startsWith('_start_date_')) { // Between
    const beginDateStr = search.substring('_start_date_'.length, '_start_date_'.length + 10);
    const beginDate = new Date(beginDateStr);
    beginDate.setHours(0, 0, 0, 0);
    const endDateStr = search.substring('_start_date_'.length + 10 + '_end_date_'.length);
    const endDate = new Date(endDateStr);
    endDate.setHours(0, 0, 0, 0);
    return beginDate <= value && endDate >= value;
  } else { // Other : Default search
    return (value.toString().toLowerCase().includes(search.toString().toLowerCase()));
  }
}

export function filterTime(value: any, search: string) {
  const dateValue = new Date();
  const dateSearch = new Date();
  const dateSearch2 = new Date();
  if (typeof value === 'string') {
    const splitVal = value.split(':');
    dateValue.setHours(Number(splitVal[0]), Number(splitVal[1]), 0, 0);
  } else {
    dateValue.setHours(value.getHours(), value.getMinutes(), 0, 0);
  }

  if (search.startsWith('_time_before_')) { // Before
    const beforeTimeStr = search.substring('_time_before_'.length);
    const splitVal = beforeTimeStr.split(':');
    dateSearch.setHours(Number(splitVal[0]), Number(splitVal[1]), 0, 0);
    return dateValue <= dateSearch;
  } else if (search.startsWith('_time_after_')) { // After
    const afterTimeStr = search.substring('_time_after_'.length);
    const splitVal = afterTimeStr.split(':');
    dateSearch.setHours(Number(splitVal[0]), Number(splitVal[1]), 0, 0);
    return dateValue >= dateSearch;
  } else if (search.startsWith('_time_equal_')) { // Egual stricte
    const equalsTimeStr = search.substring('_time_equal_'.length);
    const splitVal = equalsTimeStr.split(':');
    dateSearch.setHours(Number(splitVal[0]), Number(splitVal[1]), 0, 0);
    return dateValue.getTime() === dateSearch.getTime();
  } else if (search.startsWith('_start_time_')) { // Between
    const beginTimeStr = search.substring('_start_time_'.length, '_start_time_'.length + 5);
    const splitVal = beginTimeStr.split(':');
    dateSearch.setHours(Number(splitVal[0]), Number(splitVal[1]), 0, 0);
    const endTimeStr = search.substring('_start_time_'.length + 5 + '_end_time_'.length);
    const splitVal2 = endTimeStr.split(':');
    dateSearch2.setHours(Number(splitVal2[0]), Number(splitVal2[1]), 0, 0);
    return dateSearch <= dateValue && dateSearch2 >= dateValue;
  } else { // Other : Default search
    return (value.toString().toLowerCase().includes(search.toString().toLowerCase()));
  }
}

export function filterNumber(value: number, search: string) {
  if (search.startsWith('_number_before_')) { // Before
    const beforeNumber = search.substring('_number_before_'.length);
    return value >= Number.parseFloat(beforeNumber);
  } else if (search.startsWith('_number_after_')) { // After
    const afterNumber = search.substring('_number_after_'.length);
    return value <= Number.parseFloat(afterNumber);
  } else if (search.startsWith('_number_equal_')) { // Egual stricte
    const equalsNumber = search.substring('_number_equal_'.length);
    return value === Number.parseFloat(equalsNumber);
  } else if (search.startsWith('_start_number_')) { // Between
    const indexEnd = search.indexOf('_end_number_');
    const beginNumber = search.substring('_start_number_'.length, indexEnd);
    const endNumber = search.substring(indexEnd + '_end_number_'.length);
    return Number.parseFloat(beginNumber) <= value && Number.parseFloat(endNumber) >= value;
  } else { // Other : Default search
    return (value.toString().toLowerCase().includes(search.toString().toLowerCase()));
  }
}

export class LocalFilter {

  static filter(
    data: Array<any>,
    field: string,
    search: string,
    customFilter?: Function,
    multiSearch?: boolean,
    dateSearch?: boolean,
    timeSearch?: boolean,
    numberSearch?: boolean,
  ): Array<any> {
    const filter: Function = customFilter ? customFilter :
      (multiSearch ? filterMulti :
        (dateSearch ? filterDate :
            (timeSearch ? filterTime :
              (numberSearch ? filterNumber : filterValues)
            )
        )
      );

    return data.filter((el) => {
      const value = typeof el[field] === 'undefined' || el[field] === null ? '' : el[field];
      return filter.call(null, value, search);
    });
  }
}
