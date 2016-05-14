$(window).on('hashchange', function () {
  var hash = window.location.hash.slice(1) || 50
  genereChart(hash)
})
$(window).ready(function () {
  var hash = window.location.hash.slice(1) || 50
  genereChart(hash)
})

function genereChart (valueNumber) {
  $('#chart').html("")

  //Load database
  $.getJSON('/db.json', function (database) {
    var days = getLastDays(7)

    var data = {
      labels: [],
      labelsIndex: [],
      datasets: []
    }

    var ecartement = 0
    // For each mac adresse
    $.each(database, function (key, value) {
      var color = '#' + getColor(value.name)
      var dset = {
        label: value.name,
        backgroundColor: 'rgba(220,220,220,0)',
        borderColor: color,
        pointRadius: 3,
        pointBackgroundColor: color,
        lineTension: 0,
        fill: false,
        data: []
      }

      // generate labels
      $.each(value.ip, function (key, ip) {
        // ip = ip.slice(ip.length - 20, ip.length)
        $.each(ip, function (key, timestap) {
          var date = new Date(timestap)
          date.setSeconds(0)
          date.setMilliseconds(0)
          timestap = date.getTime()
          var index = data.labels.indexOf(timestap)
          if (index === -1) {
            data.labels.push(timestap)
            data.labels.sort()
          }
        })
      })

      //keep the les n derniers labels
      data.labels = data.labels.slice(data.labels.length - valueNumber)

      // generate plot
      $.each(value.ip, function (key, ip) {
        // ip = ip.slice(ip.length - 20, ip.length)
        $.each(ip, function (key, timestap) {
          var date = new Date(timestap)
          date.setSeconds(0)
          date.setMilliseconds(0)
          timestap = date.getTime()
          var index = data.labels.indexOf(timestap)
          if (index !== -1) {
            dset.data[index] = 1 + ecartement
          }
        })
      })

      //keep the last n element
      dset.data = dset.data.slice(dset.data.length - valueNumber)

      data.datasets.push(dset)
      ecartement += 3
    })

    //formatDate
    for (var key in data.labels) {
      data.labels[key] = formatDate(data.labels[key])
    }

    var ctx = $('#chart')

    var myBarChart = new Chart(ctx, {
      type: 'line',
      data: data
    })
  })

  function getLastDays (nb) {
    var dates = []
    for (var i = nb - 1; i >= 0; --i) {
      var d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      dates.push(d)
    }
    return dates
  }

  function formatDate (date) {
    var date = new Date(date)
    var day = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
    var hours = date.getHours().toString()
    hours = hours.length < 2 ? '0' + hours : hours
    var minutes = date.getMinutes().toString()
    minutes = minutes.length < 2 ? '0' + minutes : minutes
    return day[date.getDay()] + ' ' + hours + 'h' + minutes
  }

  String.prototype.hashCode = function () {
    var hash = 0, i, chr, len
    if (this.length === 0) return hash
    for (i = this.length / 5, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  function intToRGB (i) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase()

    return '00000'.substring(0, 6 - c.length) + c
  }

  function getColor (string) {
    return intToRGB(string.hashCode())
  }
}
