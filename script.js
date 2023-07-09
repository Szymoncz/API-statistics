document.addEventListener("DOMContentLoaded", function() {
  const startYearSelect = document.getElementById("start-year");
  const startQuarterSelect = document.getElementById("start-quarter");
  const endYearSelect = document.getElementById("end-year");
  const endQuarterSelect = document.getElementById("end-quarter");
  const generateChartButton = document.getElementById("generate-chart");

  const apiUrl = 'https://data.ssb.no/api/v0/en/table/05963';
  const params = {
    "query": [
      {
        "code": "Region",
        "selection": {
          "filter": "vs:KommunUtv2",
          "values": [
            "0301"
          ]
        }
      },
      {
        "code": "Boligtype",
        "selection": {
          "filter": "item",
          "values": [
            "01"
          ]
        }
      },
      {
        "code": "ContentsCode",
        "selection": {
          "filter": "item",
          "values": [
            "KvPris"
          ]
        }
      },
      {
        "code": "Tid",
        "selection": {
          "filter": "item",
          "values": [
            "2009K1",
            "2009K2",
            "2009K3",
            "2009K4",
            "2010K1",
            "2010K2",
            "2010K3",
            "2010K4",
            "2011K1",
            "2011K2",
            "2011K3",
            "2011K4",
            "2012K1",
            "2012K2",
            "2012K3",
            "2012K4",
            "2013K1",
            "2013K2",
            "2013K3",
            "2013K4",
            "2014K1",
            "2014K2",
            "2014K3",
            "2014K4",
            "2015K1",
            "2015K2",
            "2015K3",
            "2015K4",
            "2016K1",
            "2016K2",
            "2016K3",
            "2016K4",
            "2017K1",
            "2017K2",
            "2017K3",
            "2017K4",
            "2018K1",
            "2018K2",
            "2018K3",
            "2018K4",
            "2019K1",
            "2019K2",
            "2019K3",
            "2019K4",
            "2020K1",
            "2020K2",
            "2020K3",
            "2020K4",
            "2021K1",
            "2021K2",
            "2021K3",
            "2021K4",
            "2022K1",
            "2022K2"
          ]
        }
      }
    ],
    "response": {
      "format": "json-stat2"
    }
  };

   let labels = [];
  let values = [];

  axios.post(apiUrl, params)
    .then(function(response) {
      const ds = JSONstat(response.data).Dataset(0);

      labels = ds.Dimension("Tid").Category().map(function(Category) {
        return Category.label;
      });

      values = ds.Data().map(function(data) {
        return data.value;
      });

      const years = [...new Set(labels.map(label => label.substring(0, 4)))];
      const quarters = ["K1", "K2", "K3", "K4"];

      years.forEach(function(year) {
        const option = document.createElement("option");
        option.text = year;
        startYearSelect.add(option);
        endYearSelect.add(option.cloneNode(true));
      });

      quarters.forEach(function(quarter) {
        const option = document.createElement("option");
        option.text = quarter;
        startQuarterSelect.add(option);
        endQuarterSelect.add(option.cloneNode(true));
      });
    })
    .catch(function(error) {
      console.error(error);
    });

  generateChartButton.addEventListener("click", function() {
    const startYear = startYearSelect.value;
    const startQuarter = startQuarterSelect.value;
    const endYear = endYearSelect.value;
    const endQuarter = endQuarterSelect.value;

    const chartUrl = window.location.href;
    const newChartUrl = chartUrl + '?params:' + startYearSelect.value + startQuarterSelect.value
        + '-' + endYearSelect.value + endQuarterSelect.value;


    const selectedLabels = labels.filter(function(label) {
      const year = label.substring(0, 4);
      const quarter = label.substring(4);
      return (
        (year > startYear || (year === startYear && quarter >= startQuarter)) &&
        (year < endYear || (year === endYear && quarter <= endQuarter))
      );
    });

    const selectedValues = values.filter(function(value, index) {
      const label = labels[index];
      const year = label.substring(0, 4);
      const quarter = label.substring(4);
      return (
        (year > startYear || (year === startYear && quarter >= startQuarter)) &&
        (year < endYear || (year === endYear && quarter <= endQuarter))
      );
    });

    // Utwórz etykiety dla wykresu na podstawie wybranych danych
    const chartLabels = selectedLabels;

    // Utwórz dane dla wykresu na podstawie wybranych wartości
    const chartData = selectedValues;

    // Utwórz kontekst dla wykresu
    const ctx = document.getElementById("myChart");


    // Utwórz wykres
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Price",
            data: chartData,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
});