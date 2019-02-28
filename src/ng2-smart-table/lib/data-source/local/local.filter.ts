export class LocalFilter {

  protected static FILTER = (value: string, search: string) => {
    return value.toString().toLowerCase().includes(search.toString().toLowerCase());
  }

  protected static FILTER_MULTI = (value: string, search: string) => {
    const listSearch = search.split(';');
    const valCell = value.replace(/ /g, '');
    return (listSearch.toString().toLowerCase().includes(valCell.toString().toLowerCase()));
  }

  protected static FILTER_DATE = (value: Date, search: string) => {
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

  static filter(
    data: Array<any>,
    field: string,
    search: string,
    customFilter?: Function,
    multiSearch?: boolean,
    dateSearch?: boolean,
  ): Array<any> {
    const filter: Function = customFilter ? customFilter :
      (multiSearch ? this.FILTER_MULTI :
      (dateSearch ? this.FILTER_DATE : this.FILTER));

    return data.filter((el) => {
      const value = typeof el[field] === 'undefined' || el[field] === null ? '' : el[field];
      return filter.call(null, value, search);
    });
  }
}
