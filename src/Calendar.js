import React from 'react';
import moment from 'moment';
import { Month } from './Month';
import { range } from './utils';

const propTypes = {
  year: React.PropTypes.number.isRequired,
  forceFullWeeks: React.PropTypes.bool,
  showDaysOfWeek: React.PropTypes.bool,
  firstDayOfWeek: React.PropTypes.number,
  selectRange: React.PropTypes.bool,
  onPickDate: React.PropTypes.func,
  onPickRange: React.PropTypes.func,
  customClasses: React.PropTypes.object
};

const defaultProps = {
  year: moment().year(),
  forceFullWeeks: false,
  showDaysOfWeek: true,
  firstDayOfWeek: 0,
  selectRange: false,
  onPickDate: null,
  onPickRange: null,
  selectedDay: moment(),
  customClasses: {}
};

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectingRange: undefined
    }
  }

  dayClicked(date) {
    let { selectingRange , useless } = this.state;
    const { selectRange, onPickRange, onPickDate } = this.props;

    if( !selectRange ) {
      onPickDate && onPickDate(date);
      return;
    }

    if( !selectingRange ) {
      selectingRange = [date, date];
    } else {
      onPickRange && onPickRange(selectingRange[0], date);
      selectingRange = undefined;
    }

    this.setState({
      selectingRange
    })
  }

  dayHovered(hoveredDay) {
    let { selectingRange } = this.state;

    if( selectingRange ) {
      selectingRange[ 1 ] = hoveredDay;

      this.setState({
        selectingRange
      });
    }
  }

  _daysOfWeek() {
    const { firstDayOfWeek, forceFullWeeks } = this.props;
    const totalDays = forceFullWeeks? 42: 37;

    return (
      <tr>
        <th>
          &nbsp;
        </th>
        {
          range(firstDayOfWeek, totalDays + firstDayOfWeek).map( i => {
            let day = moment().weekday(i).format('dd').charAt(0);

            return (
              <th
                key={`weekday-${i}`}
                className={ i%7 === 0 ? 'bolder': ''}
              >
                {day}
              </th>
            )
          })
        }
      </tr>
    )
  }

  render() {
    const { year, firstDayOfWeek } = this.props;
    const { selectingRange } = this.state;

    const months = range(0,12).map( month =>
      <Month
        month={month}
        key={`month-${month}`}
        dayClicked={(d) => this.dayClicked(d)}
        dayHovered={(d) => this.dayHovered(d)}
        {...this.props}
        selectingRange={selectingRange}
      />
    );

    return (
      <table className='calendar'>
        <thead className='day-headers'>
          {this.props.showDaysOfWeek ? this._daysOfWeek() : null}
        </thead>
        <tbody>
          {months}
        </tbody>
      </table>
    );
  }
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;
