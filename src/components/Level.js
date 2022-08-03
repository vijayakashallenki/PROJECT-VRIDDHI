import {
  LEVEL_STATISTICS,
  STATISTIC_CONFIGS,
  SPRING_CONFIG_NUMBERS,
} from '../constants';
import {capitalize, formatNumber, getStatistic} from '../utils/commonFunctions';

import {HeartFillIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import {memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {animated, useSpring} from 'react-spring';
import dota from "./json.json"

function PureLevelItem({statistic, total, delta}) {
  const {t} = useTranslation();
  const spring = useSpring({
    total: total,
    delta: delta,
    config: SPRING_CONFIG_NUMBERS,
  });

  const statisticConfig = STATISTIC_CONFIGS[statistic];
  console.log(delta , "PLEASEEEEEEEE WORKKKKKKKKKKK");

  return (
    <>
      <h5>{t(capitalize(statisticConfig.displayName))}</h5>
      <animated.h4>
        {statistic !== 'active' ? (
          delta > 0 ? (
            /* Add space after + because react-spring regex bug */
            spring.delta.to(
              (delta) =>
                `+ ${formatNumber(
                  100000,
                  statisticConfig.format !== 'short'
                    ? statisticConfig.format
                    : 'long',
                  statistic
                )}`
            )
          ) : (
            <HeartFillIcon size={9} verticalAlign={2} />
          )
        ) : (
          '\u00A0'
        )}
      </animated.h4>
      <animated.h1>
        {spring.total.to((total) =>
          formatNumber(
            total,
            statisticConfig.format !== 'short'
              ? statisticConfig.format
              : 'long',
            statistic
          )
        )}
      </animated.h1>
    </>
  );
}

const LevelItem = memo(PureLevelItem);

function Level({data}) {
  // let defData = JSON.parse(dota)
  console.log(dota , "shakkkaaaabpoooomm");
  const trail = useMemo(() => {
    const styles = [];

    LEVEL_STATISTICS.map((statistic, index) => {
      styles.push({
        animationDelay: `${750 + index * 250}ms`,
        width: `calc(${100 / LEVEL_STATISTICS.length}%)`,
      });
      return null;
    });
    return styles;
  }, []);

  return (
    <div className="Level">
      {LEVEL_STATISTICS.map((statistic, index) => (
        <animated.div
          key={index}
          className={classnames('level-item', `is-${statistic}`, 'fadeInUp')}
          style={trail[index]}
        >
          <LevelItem
            {...{statistic}}
            total={getStatistic(dota, 'total', statistic)}
            delta={getStatistic(dota, 'delta', statistic)}
          />
        </animated.div>
      ))}
    </div>
  );
}

const isEqual = (prevProps, currProps) => {
  if (!equal(prevProps.dota, currProps.dota)) {
    return false;
  }
  return true;
};

export default memo(Level, isEqual);
